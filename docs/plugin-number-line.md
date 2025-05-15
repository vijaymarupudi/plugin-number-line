# plugin-number-line

An implemention of a number line estimation task outlined by Cohen and Ray that supports the bounded, unbounded, and universal versions.

## Parameters

In addition to the [parameters available in all plugins](https://www.jspsych.org/latest/overview/plugins#parameters-available-in-all-plugins), this plugin accepts the following parameters. Parameters with a default value of undefined must be specified. Other parameters can be left unspecified if the default value is acceptable.

| Parameter           | Type             | Default Value      | Description                              |
| ------------------- | ---------------- | ------------------ | ---------------------------------------- |
| stimulus            | string           | "8"                | String to be displayed as the target                                         |
| label_min           | string           | "0"                | String indicating the element to display at the lower anchor                                         |
| label_max           | string           | "10"               | String indicating the element to display at the upper-right anchor                                         |
| img_stimulus        | string           | undefined          | The path of the image file to be displayed as the target. This takes precedence over 'stimulus'.                                         |
| img_min             | string           | undefined          | The path of the image file to display at the lower anchor. This takes precedence over 'label_min'.                                         |
| img_max             | string           | undefined          | The path of the image file to display at the upper-right anchor. This takes precedence over 'label_max'.                                         |
| title               | HTML string      | "Drag and drop the bar to the position of the target number."                   |  html string that provides instructions to the participant. This is presented above the canvas container. |
| line_type           | string           | "universal"        | The type of number line task per Cohen & Ray (2020) Dev. Psychol. which controls the placement of labels and slider area (“bounded” = lower and upper label at ends of white line that spans line_length, “unbounded” = lower and upper labels, or “universal”)                                         |
| canvas_width        | numeric          | 500                | array indicating the width of the canvas container in pixels                                         |
| canvas_height       | numeric          | 100                | array indicating the height of the canvas container in pixels                                         |
| start_tick          | array of numerics | [10,50]           | array indicating the x and y location of the starting tick (in pixels)                                         |
| line_length         | numeric          | 300                | the length of the white line in pixels; it must be less than the canvas_width. The upper right anchor will be placed at this value                                         |
| response_max_length | numeric          | 400                | the max length of the red response line in pixels; it must be less than the canvas_width. This determines the max response value in pixels                                         |
| trial_end_button    | HTML string      | "FINISH"           | html for button that ends the trial                                         |
| custom_ticks        | array of dictionaries  | null         | dictionary array with each dictionary having 'pos' and 'text' keys indicating the relative position of the tick label along the number line (e.g., [{pos: 0.25, text: "0.25"},{pos: 0.5, text: "0.5"}]) |
| require_interaction | boolean          | true               | bool indicating whether the participant needs to interact with the handle before the trial_end_button is enabled                                         |
| text_color          | string           | "0x0044BB"         | hexadecimal code for the font color of string labels                                         |

## Data Generated

In addition to the [default data collected by all plugins](https://www.jspsych.org/latest/overview/plugins#data-collected-by-all-plugins), this plugin collects the following data for each trial.

| Name      | Type    | Value                                    |
| --------- | ------- | ---------------------------------------- |
| first_slide_start_rt | numeric | Response time when the initial mouse down event occurred on the slider handle (i.e., started sliding). |
| first_slide_end_rt | numeric |  Response time when the initial mouse up event occurred on the slider handle (i.e., stopped sliding). |
| last_slide_start_rt | numeric | Response time when the latest mouse down event occurred on the slider handle (i.e., started sliding). |
| last_slide_end_rt | numeric |  Response time when the latest mouse up event occurred on the slider handle (i.e., stopped sliding). |
| response  | numeric | Indicates the numeric value in pixels of the position of the handle.                                         |
| rt        | numeric | The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant selects the trial_end button.                                         |
| drag_count | numeric | The number of times the handle was released during a trial.             |

## Install

*Enter instructions for installing the plugin package here.*

## Examples

### Displaying a universal number line.

```javascript
var trial = {
  type: jsPsychPluginNumberLine,
  stimulus: "8",
  label_min: "1",
  label_max: "20",
  line_type: "universal"
}
```
### Displaying an unbounded number line. Response bias (see Cohen & Ray, 2020) can be accounted for by setting line_length, response_length, canvas_width accordingly with label_min, label_max, and stimulus.

```javascript
var trial = {
  type: jsPsychPluginNumberLine,
  stimulus: "32",
  label_min: "1",
  label_max: "10",
  line_length: 10
  response_max_length: 300,
  canvas_width: 500
  line_type: "unbounded"
}
```

### Displaying an image-based number line.

```javascript
var trial = {
  type: jsPsychPluginNumberLine,
  img_stimulus: "img_stimulus_demo.png",
  img_min: "img_min_demo.png",
  img_max: "img_max_demo.png",
  line_type: "bounded"
}
```