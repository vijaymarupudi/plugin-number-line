export type LabelAlignment = "left" | "center" | "right";

export function normalizeLabelAlignment(alignment?: string): LabelAlignment {
  if (alignment === "left" || alignment === "right") {
    return alignment;
  }

  return "center";
}

export function alignmentToAnchorX(alignment?: string): number {
  const normalizedAlignment = normalizeLabelAlignment(alignment);

  if (normalizedAlignment === "left") {
    return 0;
  }

  if (normalizedAlignment === "right") {
    return 1;
  }

  return 0.5;
}

// returns the label x (in parent coords) that keeps the requested anchor but
// snaps the label's left edge to a whole canvas pixel, so text is not blurred.
// origin_x is the parent's x position on the canvas.
export function snapLabelX(
  center_x: number,
  label_width: number,
  anchor_x: number,
  origin_x = 0
): number {
  const left = origin_x + center_x - label_width * anchor_x;
  return Math.round(left) - origin_x + label_width * anchor_x;
}

export function calculateHandleX(
  handleX: number, 
  line_type: string, 
  slider_width: number, 
  handle_half_width: number, 
  tick_half_width: number, 
  response_max_length: number
): number {
  if (line_type === "universal") {
    return Math.min(response_max_length - handle_half_width, Math.max(0, handleX));
  } else if (line_type === "bounded") {
    return Math.max(-tick_half_width, Math.min(handleX, slider_width - handle_half_width));
  } else if (line_type === "unbounded") {
    const upperBoundStart = slider_width - handle_half_width;
    return Math.max(upperBoundStart, Math.min(handleX, response_max_length - handle_half_width));
  }
  return handleX;
}
