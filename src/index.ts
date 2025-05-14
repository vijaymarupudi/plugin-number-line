import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";

function addSlider(app: typeof Application.prototype, type = "universal", label_min, label_max, start_tick, line_length, stimulus) {
  const stageWidth = app.screen.width;
  const stageHeight = app.screen.height;
  app.stage.hitArea = app.screen;

  const sliderWidth = 320;

  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });
  slider.x = (stageWidth - sliderWidth) / 2;
  slider.y = stageHeight * 0.75;

  const startTick = new Graphics().rect(0, 0, 4, 4 * 8).fill({ color: 0x272d37 });
  const endTick = new Graphics().rect(0, 0, 4, 4 * 8).fill({ color: 0x272d37 });
  startTick.x = -2;
  startTick.y = -4 * 4;
  endTick.x = sliderWidth - 2;
  endTick.y = -4 * 4;

  const handle = new Graphics().rect(0, -4 * 2, 4, 4 * 4).fill({ color: 0xffffff });
  handle.y = 0;

  if (type === "unbounded") {
    handle.x = sliderWidth  - handle.width / 2;
  } else {
    handle.x =  - handle.width / 2;
  }

  const redLine = new Graphics();
  redLine.clear().moveTo(0, 2).lineTo(handle.x, 2).stroke({ color: 0xff0000, width: 4 });

  // Add children in correct render order
  slider.addChild(redLine);
  slider.addChild(startTick);
  slider.addChild(endTick);
  slider.addChild(handle);
  app.stage.addChild(slider);

  // Add labels
  const startLabel = new Text({
    text: label_min,
    style: { fill: '#ffffff', fontSize: 14, fontFamily: 'Arial' },
  });
  startLabel.anchor.set(0.5, 0);
  startLabel.x = 0;
  startLabel.y = startTick.height + 5;
  startTick.addChild(startLabel);

  const endLabel = new Text({
    text: label_max,
    style: { fill: '#ffffff', fontSize: 14, fontFamily: 'Arial' },
  });
  endLabel.anchor.set(0.5, 0);
  endLabel.x = 0;
  endLabel.y = endTick.height + 5;
  endTick.addChild(endLabel);

  const stimulus_text = new Text({
    text: stimulus,
    style: { fill: '#ffffff', fontSize: 14, fontFamily: 'Arial' },
  });
  stimulus_text.anchor.set(0.5, 0);
  stimulus_text.x = 0;
  stimulus_text.y = startLabel.height + 5;
  startLabel.addChild(stimulus_text);

  // === Drag logic ===
  let dragging = false;

  handle.eventMode = 'static';
  handle.cursor = 'pointer';

  handle.on('pointerdown', () => {
    dragging = true;
    app.stage.eventMode = 'static'; // Make sure the stage receives events
  });

  app.stage.on('pointerup', () => {
    dragging = false;
    app.stage.eventMode = 'auto';
  });

  app.stage.on('pointerupoutside', () => {
    dragging = false;
    app.stage.eventMode = 'auto';
  });

  app.stage.on('pointermove', (e) => {
    if (!dragging) return;

    const localX = slider.toLocal(e.global).x;
    if (type === "universal") {
      handle.x = Math.max(0, localX);
    } else if (type === "bounded") {
      handle.x = Math.max(- handle.width / 2, Math.min(localX, sliderWidth - handle.width / 2));
    } else if (type === "unbounded") {
      handle.x = Math.max(- handle.width / 2, Math.max(localX, sliderWidth - handle.width / 2));
    }


    redLine.clear()
      .moveTo(0, 2)
      .lineTo(handle.x, 2)
      .stroke({ color: 0xff0000, width: 4 });

  });

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

      let label_min = "heee"
      let label_max = "hooo"
      let start_tick = 0 
      let line_length = 0
      let stimulus = "hello"
      addSlider(app, "bounded", label_min, label_max, start_tick, line_length, stimulus); // choose "universal", "bounded", or "unbounded"
    })();
  }
}

export default NumberLinePlugin;
