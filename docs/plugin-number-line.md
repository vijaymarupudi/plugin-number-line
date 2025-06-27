# plugin-number-line

An implemention of a number line estimation task outlined by Cohen and Ray that supports the bounded, unbounded, and universal versions.

## Parameters

In addition to the [parameters available in all plugins](https://www.jspsych.org/latest/overview/plugins#parameters-available-in-all-plugins), this plugin accepts the following parameters. Parameters with a default value of undefined must be specified. Other parameters can be left unspecified if the default value is acceptable.

| Parameter           | Type             | Default Value      | Description                              |
| ------------------- | ---------------- | ------------------ | ---------------------------------------- |
| stimulus            | string           | "8"                | String to be displayed as the text element target.                                         |
| text_min           | string           | "0"                | String indicating the text element to display at the lower anchor                                         |
| text_max           | string           | "10"               | String indicating the text element to display at the upper-right anchor                                         |
| media_stimulus        | string           | undefined          | The path of the media file to be displayed as the target. This takes precedence over 'stimulus'.                                         |
| media_min             | string           | undefined          | The path of the media file to display at the lower anchor. This takes precedence over 'text_min'.                                         |
| media_max             | string           | undefined          | The path of the media file to display at the upper-right anchor. This takes precedence over 'text_max'.                                         |
| media_loop             | boolean           | false          | Whether to loop the media files.                                         |
| title               | HTML string      | "Drag and drop the bar to the position of the target number."                   |  html string that provides instructions to the participant. This is presented above the canvas container. |
| line_type           | string           | "universal"        | The type of number line task per Cohen & Ray (2020) Dev. Psychol. which controls the placement of labels and slider area (“bounded” = lower and upper label at ends of white line that spans line_length, “unbounded” = lower and upper labels, or “universal”)                                         |
| canvas_width        | numeric          | 500                | array indicating the width of the canvas container in pixels                                         |
| canvas_height       | numeric          | 100                | array indicating the height of the canvas container in pixels                                         |
| start_tick_coords          | array of numerics | [10,50]           | array indicating the x and y location of the starting location (in pixels)                                         |
| line_length         | numeric          | 300                | the length of the white line in pixels; it must be less than the canvas_width. The upper right anchor will be placed at this value                                         |
| response_max_length | numeric          | 400                | the max length of the red response line in pixels; it must be less than the canvas_width. This determines the max response value in pixels                                         |
| trial_end_button    | HTML string      | "FINISH"           | html for button that ends the trial                                         |
| custom_ticks        | array of arrays  | null         | array of length two arrays with each array having a numeric proportion (0 to 1) and string label indicating the relative position of the tick label along the number line (e.g., [[0.25, "25%"],[0.5, "50%"],[0.75, "75%"]]) |
| require_interaction | boolean          | true               | bool indicating whether the participant needs to interact with the handle before the trial_end_button is enabled                                         |
| text_color          | string           | "0x0044BB"         | hexadecimal code for the font color of text labels.                                         |

When using media, they are displayed in the same pixel resolution of the corresponding files and must be hosted on a server.

## Data Generated

In addition to the [default data collected by all plugins](https://www.jspsych.org/latest/overview/plugins#data-collected-by-all-plugins), this plugin collects the following data for each trial.

| Name      | Type    | Value                                    |
| --------- | ------- | ---------------------------------------- |
| slider_start_timestamp | numeric | Timestamp (ms) when the slider was initially displayed. |
| first_slide_start_rt | numeric | Response time (ms) when the initial mouse down event occurred on the slider handle (i.e., started sliding). |
| first_slide_end_rt | numeric |  Response time (ms) when the initial mouse up event occurred on the slider handle (i.e., stopped sliding). |
| last_slide_start_rt | numeric | Response time (ms) when the latest mouse down event occurred on the slider handle (i.e., started sliding). |
| last_slide_end_rt | numeric |  Response time (ms) when the latest mouse up event occurred on the slider handle (i.e., stopped sliding). |
| final_handle_position  | numeric | Indicates the numeric value in pixels of the position of the center of the handle from the center of the minimum tick mark along the x-axis.                                         |
| response_rt        | numeric | The response time in milliseconds for the participant to make a response. The time is measured from when the slider first appears on the screen until the participant selects the trial_end button.                                         |
| drag_count | numeric | The number of times the handle was released during a trial.             |

## Install

*Enter instructions for installing the plugin package here.*

## Examples

### Displaying  bounded number line.

```javascript
var trial = {
    type: jsPsychPluginNumberLine,
    text_min: "0",
    text_max: "100",
    line_type: "bounded",
    text_stimulus:"80",
    start_tick_coords: [50, 150],
    canvas_width: 600,
    canvas_height: 300,
    line_length: 500,
    response_max_length: 500,
    preamble: `<h3>Bounded Type Demo</h3><p>Estimate the location of the number</p>`,
    text_color: '0x0044BB',
    require_interaction: true, 
    trial_end_button: "Submit",        

  };
  ```

### Displaying a universal number line.

```javascript
var trial = {
  type: jsPsychPluginNumberLine,
  text_min: "0",
  text_max: "50",
  text_stimulus: "80",
  line_type: "universal",
  start_tick_coords: [50, 150],
  canvas_width: 600,
  canvas_height: 300,
  line_length: 250,
  response_max_length: 500,
  preamble: `<h3>Universal Type Demo</h3><p>Estimate the location of the number</p>`,
  text_color: '0x0044BB',
  require_interaction: true, 
  trial_end_button: "Submit"
}
```
### Displaying an unbounded number line. Response bias (see Cohen & Ray, 2020) can be accounted for by setting line_length, response_length, canvas_width accordingly with text_min, text_max, and stimulus.

```javascript
var trial = {
  type: jsPsychPluginNumberLine,
  text_min: "0",
  text_max: "10",
  line_type: "unbounded",
  text_stimulus:"80",
  start_tick_coords: [50, 150],
  canvas_width: 600,
  canvas_height: 300,
  line_length: 50,
  response_max_length: 400,
  preamble: `<h3>Unbounded Type Demo</h3><p>Estimate the location of the number</p>`,
  text_color: '0x0044BB',
  require_interaction: true, 
  trial_end_button: "Submit"
}
```

### Displaying an image-based number line.

```javascript
var trial = {
    type: jsPsychPluginNumberLine,
    media_min: "img_min_demo.png",
    media_max: "img_max_demo.png",
    media_stimulus: "img_stimulus_demo.png",
    line_type: "universal",
    start_tick_coords: [50, 150],
    canvas_width: 600,
    canvas_height: 300,
    line_length: 400,
    response_max_length: 500,
    preamble: `Estimate the location of the number`,
    text_color: '0x0044BB',
    require_interaction: true, 
    trial_end_button: "Submit",        

};
```

### Displaying an video-based number line.

```javascript
var trial = {
    type: jsPsychPluginNumberLine,
    media_min: "low.mp4",
    media_max: "med_hi.mp4",
    media_stimulus: "high.mp4",
    media_loop: true,
    line_type: "universal",
    start_tick_coords: [50, 150],
    canvas_width: 600,
    canvas_height: 300,
    line_length: 400,
    response_max_length: 500,
    preamble: `Estimate the location of the number`,
    text_color: '0x0044BB',
    require_interaction: true, 
    trial_end_button: "Submit",        

};
```