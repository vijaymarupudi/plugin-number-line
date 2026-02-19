import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import { version } from "../package.json";
import { Application, Graphics, Container, Text, Assets, Sprite } from 'pixi.js'
import { calculateHandleX } from "./utils"; //handle movement logic

const info = <const>{
  name: "plugin-number-line",
  version: version,
  parameters: {
    text_color: {
      type: ParameterType.STRING,
      default: '#000000',
    },
    response_max_length: {
      type: ParameterType.INT,
      default: 500,
    },
    text_min: {
      type: ParameterType.STRING,
      default: [],
    },
    text_max: {
      type: ParameterType.STRING,
      default: [],
    },
    text_stimulus: {
      type: ParameterType.STRING,
      default: [],
    },
    media_min: {
      type: ParameterType.STRING,
      default: null,
    },
    media_max: {
      type: ParameterType.STRING,
      default: null,
    },
    media_stimulus: {
      type: ParameterType.STRING,
      default: null,
    },
    media_loop: {
      type: ParameterType.BOOL,
      default: false,
    },
    line_type: {
      type: ParameterType.SELECT,
      options: ["bounded", "unbounded", "universal"],
      default: "universal",
    },
    custom_ticks: {
      type: ParameterType.OBJECT,
      default: [],
    },
    canvas_width: {
      type: ParameterType.INT,
      default: 600,
    },
    canvas_height: {
      type: ParameterType.INT,
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
    line_thickness: {
      type: ParameterType.INT,
      default: 4,
    },
    preamble: {
      type: ParameterType.STRING,
      default: "Drag the handle to estimate a value.",
    },
     handle_color: {
      type: ParameterType.STRING,
      default: '#ffffff',
    },
     slider_color: {
      type: ParameterType.STRING,
      default: '#000000',
    },
     response_line_color: {
      type: ParameterType.STRING,
      default: '#ff0000',
    },
     background_color: {
      type: ParameterType.STRING,
      default: '#DDDDDD',
    },
    label_line_distance: {
      type: ParameterType.INT,
      default: 5, 
    }
  },
  data: {
    final_handle_position: { type: ParameterType.INT },
  },
  citations: '__CITATIONS__',
};

type Info = typeof info;


function add_slider(app: typeof Application.prototype, line_type, text_min, text_max, start_tick_coords, line_length, line_thickness, custom_ticks, text_stimulus, text_color, response_max_length, media_stimulus, media_max, media_min, media_loop, handle_color, slider_color, response_line_color, on_first_move, label_line_distance) {
  // assigning width and height of the section that contains the slider
  const stage_width = app.screen.width;
  const stage_height = app.screen.height;
  app.stage.hitArea = app.screen;

  // assigning thickness to slider and tick marks
  const slider_width = line_length;
  const slider_thickness = line_thickness;
  const tick_width = slider_thickness;
  const tick_half_width = tick_width / 2;

  // assigning colors to relevant lines
  console.log("slider_color",slider_color);
  console.log("handle_color",handle_color);
  console.log("response_line_color",response_line_color);

  // assigning slider location
  const slider = new Graphics().rect(0, -slider_thickness / 2, slider_width, slider_thickness).fill({ color: slider_color });
  slider.x = start_tick_coords[0] + tick_half_width;
  slider.y = start_tick_coords[1];

  // assigning start and end tick locations
  const start_tick = new Graphics().rect(0, 0, slider_thickness, slider_thickness * 8).fill({ color: slider_color });
  const end_tick = new Graphics().rect(0, 0, slider_thickness, slider_thickness * 8).fill({ color: slider_color });
  start_tick.x = -tick_half_width;
  start_tick.y = -4 * slider_thickness;
  end_tick.x = slider_width - tick_half_width;
  end_tick.y = -4 * slider_thickness;

  // assigning all tick locations
  for (let i = 0; i < custom_ticks.length; i++) {
    const [xi, yi] = custom_ticks[i];
    const xPos = xi * slider_width;
  
    const tick = new Graphics().rect(0, start_tick.y, 2, 8 * 4).fill({ color: slider_color });
    tick.x = xPos - 1;
    slider.addChild(tick);
  
    const label = new Text({
      text: yi,
      style: { fontSize: 10, fill: text_color},
    });

    // assigning tick labels
    label.anchor.set(0.5, 0); // the anchor is set to the top-center
    label.x = xPos;
    label.y = start_tick.y + 8 * 4 + label_line_distance; // and the label position is just below the tick
    slider.addChild(label);
  }
  
  // creating a handle
  const handle = new Graphics().rect(0, -4 * slider_thickness / 2, slider_thickness, 4 * slider_thickness).fill({ color: handle_color });

  // assigning handle location
  const handle_half_width = handle.width / 2 ;
  handle.y = 0;
  if (line_type == "unbounded") {
    handle.x = slider_width  - handle_half_width;;
  } else {
    handle.x = -tick_half_width;
  }

  // creating a response line
  const response_line_thickness = slider_thickness;
  const response_line = new Graphics();

  // assigning response line locations
  response_line.y = 0;
  response_line.clear()
    .moveTo(-tick_half_width + handle_half_width, 0)
    .lineTo(handle.x + handle_half_width, 0)
    .stroke({ color: response_line_color, width: response_line_thickness });

  // adding children in correct render order
  slider.addChild(response_line);
  slider.addChild(start_tick);
  slider.addChild(end_tick);
  slider.addChild(handle);
  app.stage.addChild(slider);


  // creation of image labels
  if (media_stimulus != null) {
    const start_image = media_min;
    const end_image = media_max;
    const stimulus_image = media_stimulus;
  
    Promise.all([
      Assets.load(start_image),
      Assets.load(end_image),
      Assets.load(stimulus_image)
    ]).then(([start_tex, end_tex, stim_tex]) => {

      // looping of image labels for non-stationary media
      if(media_loop){
        if(start_tex.baseTexture.resource instanceof HTMLVideoElement){
          start_tex.baseTexture.resource.loop = true;
        }
        if(end_tex.baseTexture.resource instanceof HTMLVideoElement){
          end_tex.baseTexture.resource.loop = true;
        }
        if(stim_tex.baseTexture.resource instanceof HTMLVideoElement){
          stim_tex.baseTexture.resource.loop = true;
        }
      }
      
      const start_sprite = new Sprite(start_tex);
      start_sprite.name = "start_img";
      start_sprite.anchor.set(0.5, 0);
      start_sprite.x = 0;
      start_sprite.y = start_tick.height + 5;

      start_tick.addChild(start_sprite);
  
      const end_sprite = new Sprite(end_tex);
      end_sprite.name = "end_img";
      end_sprite.anchor.set(0.5, 0);
      end_sprite.x = 0;
      end_sprite.y = end_tick.height + 5;

      end_tick.addChild(end_sprite);
  
      const stim_sprite = new Sprite(stim_tex);
      stim_sprite.name = "stimulus_img";
      stim_sprite.anchor.set(0.5, 0);
      stim_sprite.x = 0;
      stim_sprite.y = start_sprite.height + 10;

      start_sprite.addChild(stim_sprite);

    })
  }
  // creation of non-image labels 
  else {
    const start_label = new Text({
      text: text_min,
      style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
    });
    start_label.anchor.set(0.5, 0);
    start_label.x = 0;
    start_label.y = start_tick.height + label_line_distance;
    start_tick.addChild(start_label);
  
    const end_label = new Text({
      text: text_max,
      style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
    });
    end_label.anchor.set(0.5, 0);
    end_label.x = 0;
    end_label.y = end_tick.height + label_line_distance;
    end_tick.addChild(end_label);
  
    const stimulus_text = new Text({
      text: text_stimulus,
      style: { fill: text_color, fontSize: 14, fontFamily: 'Arial' },
    });
    stimulus_text.anchor.set(0.5, 0);
    stimulus_text.x = 0;
    stimulus_text.y = start_label.height + label_line_distance;
    start_label.addChild(stimulus_text);
  }
  
  // dragging logic
  let dragging = false;

  handle.eventMode = 'static';
  handle.cursor = 'pointer';
  let has_moved = false;

  handle.on('pointerdown', () => {
    dragging = true;
    app.stage.eventMode = 'static';
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
    const rawHandleX = localX - handle.width / 2;

    handle.x = calculateHandleX(
      rawHandleX, 
      line_type, 
      slider_width, 
      handle_half_width, 
      tick_half_width, 
      response_max_length
    );

    

    response_line.clear()
      .moveTo(-tick_half_width + handle_half_width, 0)
      .lineTo(handle.x + handle.width, 0)
      .stroke({ color: response_line_color, width: response_line_thickness });

    if (!has_moved) {
      has_moved = true;
      on_first_move?.();  
    }
  });

  // saving data

  console.log("--- Slider Info ---");
  console.log("Slider Position (x, y):", slider.x, slider.y);
  console.log("Slider Dimensions (width, height):", slider.width, slider.height);
  console.log("Slider Bounding Box:", slider.getBounds());

  console.log("\n--- Handle Info ---");
  console.log("Handle Position (x, y):", handle.x, handle.y);
  console.log("Handle Dimensions (width, height):", handle.width, handle.height);
  console.log("Handle Global Position (x, y):", handle.getGlobalPosition().x, handle.getGlobalPosition().y);
  console.log("Handle Bounding Box:", handle.getBounds());

  console.log("\n--- Start Tick Info ---");
  console.log("Start Tick Position (x, y):", start_tick.x, start_tick.y);
  console.log("Start Tick Dimensions (width, height):", start_tick.width, start_tick.height);
  console.log("Start Tick Global Position (x, y):", start_tick.getGlobalPosition().x, start_tick.getGlobalPosition().y);
  console.log("Start Tick Bounding Box:", start_tick.getBounds());

  console.log("\n--- End Tick Info ---");
  console.log("End Tick Position (x, y):", end_tick.x, end_tick.y);
  console.log("End Tick Dimensions (width, height):", end_tick.width, end_tick.height);
  console.log("End Tick Global Position (x, y):", end_tick.getGlobalPosition().x, end_tick.getGlobalPosition().y);
  console.log("End Tick Bounding Box:", end_tick.getBounds());

  console.log("\n--- Response Line Info ---");
  console.log("Response Line Position (x, y):", response_line.x, response_line.y);
  console.log("Response Line Bounding Box:", response_line.getBounds());
  return { handle, slider_width};

}

// html structuring
class NumberLinePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}
    trial(display_element: HTMLElement, trial: TrialType<Info>) {
      (async () => {
        const container = document.createElement("div");
        container.classList.add("jspsych-numberline-container");
        container.style.display = "flex";       
        container.style.flexDirection = "column"; 
        container.style.alignItems = "center";    
        container.style.gap = "20px";             
        display_element.appendChild(container);
        
        if (trial.preamble) {
          const preamble = document.createElement("div");
          preamble.innerHTML = trial.preamble;
          preamble.style.fontSize = "16px";
          preamble.style.marginBottom = "10px";
          preamble.style.textAlign = "center";
          container.appendChild(preamble);
        }
        const app = new Application();
        await app.init({
          background: trial.background_color,
          width: trial.canvas_width,
          height: trial.canvas_height,
        });
      container.appendChild(app.canvas);

      let button: HTMLButtonElement | null = null;
        
      const { handle, slider_width } = add_slider(
        app,
        trial.line_type,
        trial.text_min,
        trial.text_max,
        trial.start_tick_coords,
        trial.line_length,
        trial.line_thickness,
        trial.custom_ticks,
        trial.text_stimulus,
        trial.text_color,
        trial.response_max_length,
        trial.media_stimulus,
        trial.media_max,
        trial.media_min,
        trial.media_loop,
        trial.handle_color,
        trial.slider_color,
        trial.response_line_color,
        () => {
          if (button) button.style.display = "block";
        },
        trial.label_line_distance
      );
   
        button = document.createElement("button");

        button.innerHTML = trial.trial_end_button;
        button.id = "jspsych-numberline-response-next";
        button.classList.add("jspsych-numberline-finish-button");

        container.appendChild(button);
        if (trial.require_interaction) {
          button.disabled = true;
        }

      // data saving
      let dragging = false;
      let start_time = null;
      let first_slide_start_rt = null;
      let first_slide_end_rt = null;
      let last_slide_start_rt = null;
      let last_slide_end_rt = null;
      let drag_count = 0;

      handle.on('pointerdown', () => {
        const now = performance.now();
        drag_count += 1;
        if (first_slide_start_rt === null) {
          first_slide_start_rt = Math.round(now - start_time);
          display_element.querySelector<HTMLInputElement>(
            "#jspsych-numberline-response-next"
          ).disabled = false;
        }
        last_slide_start_rt = Math.round(now - start_time);
      });

      app.stage.on('pointerup', () => {
        if (dragging) {
          const now = performance.now();
          if (first_slide_end_rt === null) {
            first_slide_end_rt = Math.round(now - start_time);
          }
          last_slide_end_rt = Math.round(now - start_time);
        }
        dragging = false;
        app.stage.eventMode = 'auto';
      });

      app.stage.on('pointerupoutside', () => {
        if (dragging) {
          const now = performance.now();
          if (first_slide_end_rt === null) {
            first_slide_end_rt = Math.round(now - start_time);
          }
          last_slide_end_rt = Math.round(now - start_time);
        }
        dragging = false;
        app.stage.eventMode = 'auto';
      });
      
        button.style.marginTop = "20px";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.cursor = "pointer";
        container.appendChild(button);

        button.addEventListener("click", () => {
          const now = performance.now();
          if (first_slide_end_rt === null) {
            first_slide_end_rt = Math.round(now - start_time);
          }
          if (last_slide_end_rt === null) {
            last_slide_end_rt = Math.round(now - start_time);
          }
          const end_rt = Math.round(now - start_time);
          const handleCenterX = handle.x + handle.width / 2;

          this.jsPsych.finishTrial({
            final_handle_position: handleCenterX,
            slider_start_timestamp: Math.round(start_time),
            response_rt: end_rt,
            first_slide_start_rt: first_slide_start_rt,
            first_slide_end_rt: first_slide_end_rt,
            last_slide_start_rt: last_slide_start_rt,
            last_slide_end_rt: last_slide_end_rt,
            drag_count: drag_count,
          });
        });

      start_time = performance.now();
    })();
  }
}


export default NumberLinePlugin;
