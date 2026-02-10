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