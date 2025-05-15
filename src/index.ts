import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "plugin-number-line",
  version: version,
  parameters: {
    text_color: {
      type: ParameterType.STRING,
      default: '0x000000',
    },
    response_max_length: {
      type: ParameterType.INT,
      default: 500,
    },
    label_min: {
      type: ParameterType.STRING,
      default: [],
    },
    label_max: {
      type: ParameterType.STRING,
      default: [],
    },
    stimulus: {
      type: ParameterType.STRING,
      default: [],
    },
    line_type: {
      type: ParameterType.STRING,
      default: "universal",
    },
    custom_ticks: {
      type: ParameterType.OBJECT,
      default: [],
    },
    canvas_width: {
      type: ParameterType.STRING,
      default: 600,
    },
    canvas_height: {
      type: ParameterType.STRING,
      default: 300,
    },
    start_tick_coords: {
      type: ParameterType.OBJECT,
      default: [50, 150],
    },
    line_length: {
      type: ParameterType.INT,
      default: 250,
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

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";



function addSlider(app: typeof Application.prototype, line_type, label_min, label_max, start_tick, line_length, custom_ticks, stimulus, text_color, response_max_length ) {
  const stageWidth = app.screen.width;
  const stageHeight = app.screen.height;
  app.stage.hitArea = app.screen;

  const sliderWidth = line_length;

  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });
  slider.x = start_tick[0];
  slider.y = start_tick[1];

  const startTick = new Graphics().rect(0, 0, 4, 4 * 8).fill({ color: 0x272d37 });
  const endTick = new Graphics().rect(0, 0, 4, 4 * 8).fill({ color: 0x272d37 });
  startTick.x = -2;
  startTick.y = -4 * 4;
  endTick.x = sliderWidth - 2;
  endTick.y = -4 * 4;



  for (let i = 0; i < custom_ticks.length; i++) {
    const [xi, yi] = custom_ticks[i];
    const xPos = xi * sliderWidth;
  
    const tick = new Graphics().rect(0, startTick.y, 2, 8 * 4).fill({ color: 0x000000 });
    tick.x = xPos - 1;
    slider.addChild(tick);
  
    const label = new Text({
      text: yi,
      style: { fontSize: 10, fill: 0x000000},
    });
    label.anchor.set(0.5, 0); // anchor top-center
    label.x = xPos;
    label.y = startTick.y + 8 * 4 + 4; // position just below the tick
    slider.addChild(label);
  }
  
  const handle = new Graphics().rect(0, -4 * 2, 4, 4 * 4).fill({ color: 0xffffff });

  handle.y = 0;
  if (line_type == "unbounded") {
    handle.x = sliderWidth  - handle.width / 2;
  } else {
    handle.x = 0 - handle.width / 2;
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
    style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
  });
  startLabel.anchor.set(0.5, 0);
  startLabel.x = 0;
  startLabel.y = startTick.height + 5;
  startTick.addChild(startLabel);

  const endLabel = new Text({
    text: label_max,
    style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
  });
  endLabel.anchor.set(0.5, 0);
  endLabel.x = 0;
  endLabel.y = endTick.height + 5;
  endTick.addChild(endLabel);

  const stimulus_text = new Text({
    text: stimulus,
    style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
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
    if (line_type === "universal") {
      handle.x = Math.min(response_max_length, Math.max(0, localX)) - handle.width / 2;
    } else if (line_type === "bounded") {
      handle.x = Math.max(0, Math.min(localX, sliderWidth )) - handle.width / 2;
    } else if (line_type === "unbounded") {
      handle.x = Math.min(response_max_length, Math.max(0, Math.max(localX, sliderWidth))) - handle.width / 2;
    }

    redLine.clear()
      .moveTo(0, 2)
      .lineTo(handle.x, 2)
      .stroke({ color: 0xff0000, width: 4 });
  });

  return { handle, sliderWidth};      //Data saving

}

class NumberLinePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    (async () => {
      const app = new Application();

      await app.init({
        background: '#DDDDDD',
        width: trial.canvas_width,
        height: trial.canvas_height,
      });
      display_element.appendChild(app.canvas);

      const { handle, sliderWidth } = addSlider(
        app,
        trial.line_type,
        trial.label_min,
        trial.label_max,
        trial.start_tick_coords,
        trial.line_length,
        trial.custom_ticks,
        trial.stimulus,
        trial.text_color,
        trial.response_max_length
      );

      // save the data
      handle.on('pointerup', () => {
        const handleCenterX = handle.x + handle.width / 2;
        const responseRatio = handleCenterX / sliderWidth; // position of handle : 0-1

        this.jsPsych.finishTrial({
          data1: Math.round(responseRatio * 1000),  // position of handle : 0-1000
          data2: "response_recorded",
        });
      });
    })();
  }
}

export default NumberLinePlugin;