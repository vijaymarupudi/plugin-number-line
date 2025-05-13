import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare global {
  interface Window {
    PIXI: any
  }
}

const { Application, Graphics, Container, Text } = window.PIXI

import { version } from "../package.json";

function buildLine(graphics, startx=0, starty=0, endx=100, endy=0)
{
    // Draw horizontal line

    // Move to top of the line
    graphics
        .moveTo(startx, starty)
        // Draw down to bottom
        .lineTo(endx,endy);

    return graphics;
}

function render(app) {

    // Create horizontal line
    const whiteLine = buildLine(new Graphics(),1,0,150,0).stroke({ color: 0xffffff, pixelLine: true, width: 1 });

    const redLine = buildLine(new Graphics(),150,0,300,0).stroke({ color: 0xff0000, pixelLine: true, width: 1 });

    const redHandle = buildLine(new Graphics(),1,-50,1,50).stroke({ color: 0xff0000, pixelLine: true, width: 1 });

    // Create a container to hold both grids
    const container = new Container();

    container.addChild(whiteLine,redLine,redHandle);

    // Center the container on screen
    container.x = app.screen.width / 5;
    container.y = app.screen.height / 2;
    app.stage.addChild(container);

    // Add descriptive label
    const label = new Text({
        text: 'Number Line Task',
        style: { fill: 0xffffff },
    });

    // Position label in top-left corner
    label.position.set(20, 20);
    label.width = app.screen.width - 40;
    label.scale.y = label.scale.x;
    app.stage.addChild(label);

}

const info = <const>{
  name: "plugin-number-line",
  version: version,
  parameters: {
    /** Provide a clear description of the parameter_name that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
    reaction_time: {
      type: ParameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEY, KEYS, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
      default: 300,
    },
    /** Provide a clear description of the parameter_name2 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */

  },
  data: {
    /** Provide a clear description of the data1 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
    data1: {
      type: ParameterType.INT,
    },
    /** Provide a clear description of the data2 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
    data2: {
      type: ParameterType.STRING,
    },
  },
  // When you run build on your plugin, citations will be generated here based on the information in the CITATION.cff file.
  citations: '__CITATIONS__',
};

type Info = typeof info;

/**
 * **plugin-number-line**
 *
 * An implemention of a number line estimation task outlined by Cohen and Ray
 *
 * @author jsPsych hackathon
 * @see {@link /plugin-number-line/README.md}}
 */
class NumberLinePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {


    (async () => {

      const app = new Application();

    // Initialize the application
    await app.init({ background: '#000000', resizeTo: window });

    display_element.appendChild(app.canvas)

    render(app)

//     display_element.innerHTML = "Hello"

    })()

    
    
    // end trial
    // this.jsPsych.finishTrial(trial_data);
  }
}

export default NumberLinePlugin;
