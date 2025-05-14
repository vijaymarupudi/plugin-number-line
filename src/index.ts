import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";

function buildLine(graphics, startx=0, starty=0, endx=100, endy=0) {
  graphics.moveTo(startx, starty).lineTo(endx,endy);
  return graphics;
}

function render(app) {
  const whiteLine = buildLine(new Graphics(),1,0,150,0).stroke({ color: 0xffffff, pixelLine: true, width: 1 });
  const redLine = buildLine(new Graphics(),150,0,300,0).stroke({ color: 0xff0000, pixelLine: true, width: 1 });
  const redHandle = buildLine(new Graphics(),1,-50,1,50).stroke({ color: 0xff0000, pixelLine: true, width: 1 });

  const container = new Container();
  container.addChild(whiteLine, redLine, redHandle);
  container.x = app.screen.width / 5;
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  const label = new Text({
    text: 'Number Line Task',
    style: { fill: 0xffffff },
  });
  label.position.set(20, 20);
  label.width = app.screen.width - 40;
  label.scale.y = label.scale.x;
  app.stage.addChild(label);
}

function addSlider(app: typeof Application.prototype, type = "universal") {
  const stageWidth = app.screen.width;
  const stageHeight = app.screen.height;
  const sliderWidth = 320;

  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });
  slider.x = (stageWidth - sliderWidth) / 2;
  slider.y = stageHeight * 0.75;

  const handle = new Graphics().circle(0, 0, 8).fill({ color: 0xffffff });
  handle.y = slider.height / 2;

  if (type === "unbounded") {
    handle.x = stageWidth - (stageWidth - sliderWidth) / 2 - sliderWidth / 2 + handle.width;
  } else {
    handle.x = sliderWidth / 2;
  }

  handle.eventMode = 'static';
  handle.cursor = 'pointer';
  handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);

  app.stage.addChild(slider);
  slider.addChild(handle);

  function onDragStart() {
    app.stage.eventMode = 'static';
    app.stage.addEventListener('pointermove', onDrag);
  }

  function onDragEnd() {
    app.stage.eventMode = 'auto';
    app.stage.removeEventListener('pointermove', onDrag);
  }

  function onDrag(e) {
    const halfHandleWidth = handle.width / 2;
    const localX = slider.toLocal(e.global).x;

    if (type === "universal") {
      handle.x = Math.max(halfHandleWidth, localX);
    } else if (type === "bounded") {
      handle.x = Math.max(halfHandleWidth, Math.min(localX, sliderWidth - halfHandleWidth));
    } else if (type === "unbounded") {
      handle.x = Math.max(halfHandleWidth, Math.max(localX, sliderWidth - halfHandleWidth));
    }

    const t = 2 * (handle.x / sliderWidth - 0.5);
    // do something with `t`, e.g., scale feedback object or record response
  }
}

const info = <const>{
  name: "plugin-number-line",
  version: version,
  parameters: {
    reaction_time: {
      type: ParameterType.INT,
      default: 300,
    },
  },
  data: {
    data1: {
      type: ParameterType.INT,
    },
    data2: {
      type: ParameterType.STRING,
    },
  },
  citations: '__CITATIONS__',
};

type Info = typeof info;

class NumberLinePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    (async () => {
      const app = new Application();
      await app.init({ background: '#000000', resizeTo: window });
      display_element.appendChild(app.canvas);

      render(app);
      addSlider(app, "universal"); // choose "universal", "bounded", or "unbounded"
    })();
  }
}

export default NumberLinePlugin;
