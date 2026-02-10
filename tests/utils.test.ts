import { calculateHandleX } from '../src/utils';

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