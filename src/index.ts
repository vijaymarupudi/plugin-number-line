import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";

function addSlider(app: typeof Application.prototype, type = "universal", label_min, label_max, start_tick, line_length, custom_ticks, stimulus) {
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
  

  const handle = new Graphics().rect(0, -4*4, 4, 4*8).fill({ color: 0xffffff });
  handle.y = 0;

  

  if (type === "unbounded") {
    handle.x = sliderWidth/2  + handle.width;
  } else {
    handle.x = 0;
  }

  handle.eventMode = 'static';
  handle.cursor = 'pointer';
  handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);
  const redLine = new Graphics();
  redLine.clear()
    .moveTo(0, 2)
    .lineTo(handle.x, 2)
    .stroke({ color: 0xff0000, width: 4 });


  
  
  slider.addChild(endTick);

  app.stage.addChild(slider);

  slider.addChild(redLine);
  slider.addChild(startTick);

  slider.addChild(handle);

  // slider.setChildIndex(redLine, 0);
  const startLabel = new Text({
    text: label_min,
    style: {
      fill: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial',
    },
  });
  startLabel.anchor.set(0.5, 0); // center horizontally
  startLabel.x = 0;
  startLabel.y =  startTick.height - 5 ;
  startTick.addChild(startLabel); // or app.stage.addChild(startLabel);

  const endLabel = new Text({
    text: label_max,
    style: {
      fill: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial',
    },
  });
  endLabel.anchor.set(0.5, 0); // center horizontally
  endLabel.x = 0;
  endLabel.y =  endTick.height + 5;
  endTick.addChild(endLabel); // or app.stage.addChild(startLabel);

  const stimulus_text = new Text({
    text: stimulus,
    style: {
      fill: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial',
    },
  });
  stimulus_text.anchor.set(0.5, 0); // center horizontally
  stimulus_text.x = 0;
  stimulus_text.y =  startLabel.height + 5 ;
  startLabel.addChild(stimulus_text); // or app.stage.addChild(startLabel);

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
      handle.x = Math.max(0, Math.max(localX, sliderWidth));
    }

    const t = 2 * (handle.x / sliderWidth - 0.5);
    // do something with `t`, e.g., scale feedback object or record response
    redLine.clear()
    .moveTo(0, 2)
    .lineTo(handle.x, 2)
    .stroke({ color: 0xff0000, width: 4 });
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

      let label_min = "1"
      let label_max = "10"
      let startPos = 0 
      let endPos = 0
      let stimulus = "7"
      let custom_ticks = [[0.125, "12.5%"], [0.25, "25%"], [0.375, "37.5%"], [0.5, "50%"],  [0.625, "62.5%"], [0.75, "75%"], [0.875, "87.5%"], [0.9, "90%"]]
      let start_tick = 100
      let line_length = 500
      addSlider(app, "universal", label_min, label_max, start_tick, line_length, custom_ticks, stimulus); // choose "universal", "bounded", or "unbounded"
    })();
  }
}

export default NumberLinePlugin;
