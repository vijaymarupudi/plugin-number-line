import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";

function addSlider(app: typeof Application.prototype, type = "universal", startNum, endNum, startPos, endPos) {
  const stageWidth = app.screen.width;
  const stageHeight = app.screen.height;
  const sliderWidth = 320;

  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });
  slider.x = (stageWidth - sliderWidth) / 2;
  slider.y = stageHeight * 0.75;

  const startTick = new Graphics().rect(0, 0, 4, 4*8).fill({ color: 0x272d37 });
  const endTick = new Graphics().rect(0, 0, 4, 4*8).fill({ color: 0x272d37 });
  startTick.x = -2;
  startTick.y = -4 * 4;
  endTick.x = sliderWidth - 2;
  endTick.y = -4 * 4;

  const handle = new Graphics().circle(0, 0, 8).fill({ color: 0xffffff });
  handle.y = slider.height / 2;

  if (type === "unbounded") {
    handle.x = sliderWidth/2  + handle.width;
  } else {
    handle.x = sliderWidth / 2;
  }

  handle.eventMode = 'static';
  handle.cursor = 'pointer';
  handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);
  
  slider.addChild(startTick);
  slider.addChild(endTick);

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
      handle.x = Math.max(0, localX);
    } else if (type === "bounded") {
      handle.x = Math.max(0, Math.min(localX, sliderWidth));
    } else if (type === "unbounded") {
      handle.x = Math.max(0, Math.max(localX, sliderWidth ));
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
    title: {
      type: ParameterType.STRING,
      default: "Drag the handle to estimate a value.",
    },
    number_line_type: {
      type: ParameterType.SELECT,
      options: ["bounded", "unbounded", "universal"],
      default: "universal",
    },
  },
  data: {
    data1: { type: ParameterType.INT },
    data2: { type: ParameterType.STRING },
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
      await app.init({ background: '#DDDDDD', resizeTo: window });
      display_element.appendChild(app.canvas);

      let startNum = 0
      let endNum = 10
      let startPos = 0 
      let endPos = 0
      addSlider(app, "bounded", startNum, endNum, startPos, endPos); // choose "universal", "bounded", or "unbounded"
    })();
  }
}

export default NumberLinePlugin;
