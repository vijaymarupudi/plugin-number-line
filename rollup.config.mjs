import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: "src/index.ts",
  plugins: [json(), typescript()],
  output: [
    {
      file: "dist/index.mjs",
      format: "es"
    },
    {
      file: "dist/index.browser.js",
      format: "umd",
      name: "jsPsychPluginNumberLine",
      globals: {
        "pixi.js": "PIXI",
        "jspsych": "jsPsychModule"
      }
    }],
  external: ["pixi.js", "jspsych"]
}
