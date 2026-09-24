import {
  alignmentToAnchorX,
  calculateHandleX,
  normalizeLabelAlignment,
  snapLabelX,
} from '../src/utils';

describe('Label alignment', () => {
  test.each([
    ['left', 0],
    ['center', 0.5],
    ['right', 1],
  ])('maps %s alignment to the expected PixiJS anchor', (alignment, expectedAnchor) => {
    expect(alignmentToAnchorX(alignment)).toBe(expectedAnchor);
  });

  test('defaults missing or invalid alignment values to center', () => {
    expect(normalizeLabelAlignment()).toBe('center');
    expect(normalizeLabelAlignment('invalid')).toBe('center');
    expect(alignmentToAnchorX()).toBe(0.5);
    expect(alignmentToAnchorX('invalid')).toBe(0.5);
  });
});

describe('Label pixel snapping', () => {
  const leftEdge = (x: number, width: number, anchor: number, origin = 0) =>
    origin + x - width * anchor;

  test('centers exactly when tick and label widths share parity', () => {
    // tick 4 wide (center 2), label 6 wide -> left edge at -1
    expect(snapLabelX(2, 6, 0.5)).toBe(2);
    // tick 5 wide (center 2.5), label 7 wide -> left edge at -1
    expect(snapLabelX(2.5, 7, 0.5)).toBe(2.5);
  });

  test('snaps the left edge to a whole pixel, shifting right by 0.5 on parity mismatch', () => {
    // tick 4 wide, label 7 wide -> -1.5 snaps to -1
    const x = snapLabelX(2, 7, 0.5);
    expect(leftEdge(x, 7, 0.5)).toBe(-1);
    expect(x).toBe(2.5);
  });

  test('snaps against the canvas grid using the parent origin', () => {
    // parent sits at 52.5 on the canvas (odd thickness), label 6 wide
    const x = snapLabelX(0, 6, 0.5, 52.5);
    expect(Number.isInteger(leftEdge(x, 6, 0.5, 52.5))).toBe(true);
  });

  test.each([0, 0.5, 1])('keeps left edges whole for anchor %s', (anchor) => {
    const x = snapLabelX(2.5, 13, anchor, 50);
    expect(Number.isInteger(leftEdge(x, 13, anchor, 50))).toBe(true);
  });
});

describe('NumLin Handle Boundary Logic (CRNL Strict Compliance)', () => {
  const SLIDER_WIDTH = 250;
  const HANDLE_HALF = 2;
  const TICK_HALF = 2;
  const MAX_LEN = 500;

  /**
   * Line type = Bounded: 
   * Bounded type has a fixed labeled upper and a fixed labeled lower bound
   * User responses can ONLY occur between these bounds
   */
  test('Bounded: Responses must stay within the lower and upper bounds', () => {
    // Snap to start tick (-2) when clicking far left
    expect(calculateHandleX(-50, 'bounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(-TICK_HALF);
    
    // Snap to end of slider (248) when clicking far right
    expect(calculateHandleX(300, 'bounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(SLIDER_WIDTH - HANDLE_HALF);
  });

  /**
   * Line type = Unbounded:
   * Unbounded type has a fixed labeled lower bound and an upper bound set at one unit above
   * User responses can ONLY occur ABOVE the upper bound (slider end)
   */
  test('Unbounded: Responses are restricted to the area above the upper bound', () => {
    const UPPER_BOUND_POS = SLIDER_WIDTH - HANDLE_HALF; // 248

    // Clicks near the lower bound (-10) or in the middle of the line (100) 
    // must snap to the upper bound (248) per strict CRNL rules.
    expect(calculateHandleX(-10, 'unbounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(UPPER_BOUND_POS);
    expect(calculateHandleX(100, 'unbounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(UPPER_BOUND_POS);

    // Clicks beyond the slider end (400) are allowed freely up to MAX_LEN.
    expect(calculateHandleX(400, 'unbounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(400);
  });

  /**
   * Line type = Universal:
   * Universal type has a fixed labeled lower bound and a labeled upper bound.
   * User responses can occur BOTH between the two bounds and above the upper bound.
   */
  test('Universal: Handle moves freely from 0 to MAX_LEN, crossing the upper bound', () => {
    // Allowed inside the bounds (10)
    expect(calculateHandleX(10, 'universal', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(10);
    
    // Allowed beyond the upper bound (450)
    expect(calculateHandleX(450, 'universal', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(450);
  });
});
