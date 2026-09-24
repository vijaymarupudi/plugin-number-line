# TODO

## Fix video looping across trials

When two trials use the same video file, `media_loop: false` has no effect if an
earlier trial set `media_loop: true`: the video keeps looping. A video that already
finished playing in an earlier trial also does not restart; it stays on its last frame.

**Cause:** PixiJS `Assets` caches textures by URL, so every trial that uses the same
file gets the same `HTMLVideoElement`. The plugin only sets `loop = true` when
`media_loop` is true and never resets it, so the setting carries over to later trials.

**Where:** the media label block in `add_slider` in `src/index.ts`.

**Fix:**
- On every trial, set `resource.loop = Boolean(media_loop)` for each video texture.
- Restart playback with `currentTime = 0` and `play()`.
- Replace the deprecated `texture.baseTexture.resource` (PixiJS v7) with
  `texture.source.resource`, which also removes the console deprecation warning.

**Reproduce:** run two trials that use the same video files, the first with
`media_loop: true` and the second with `media_loop: false`. The second trial's videos
keep looping.
