import { calculateHandleX } from '../src/utils';

describe('NumLin Handle Boundary Logic', () => {
  const SLIDER_WIDTH = 250;
  const HANDLE_HALF = 2; // line_thickness가 4일 때
  const TICK_HALF = 2;
  const MAX_LEN = 500;

  test('Bounded: 범위를 벗어난 클릭은 양 끝점에 고정되어야 한다', () => {
    // 왼쪽 밖 클릭 시 시작점(-2)에 고정
    expect(calculateHandleX(-50, 'bounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(-TICK_HALF);

    // 오른쪽 밖 클릭 시 끝점(250-2=248)에 고정
    expect(calculateHandleX(300, 'bounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(SLIDER_WIDTH - HANDLE_HALF);
  });

  test('Unbounded: 시작점 미만은 막히고, 끝점 이상은 허용되어야 한다', () => {
    // 시작점 미만 클릭 시 고정
    expect(calculateHandleX(-10, 'unbounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(-TICK_HALF);

    // 끝점(250)을 넘어서 400 지점 클릭 시 400 그대로 반환
    expect(calculateHandleX(400, 'unbounded', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(400);
  });

  test('Universal: 0부터 MAX_LEN 사이에서 자유롭게 움직여야 한다', () => {
    expect(calculateHandleX(10, 'universal', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(10);
    expect(calculateHandleX(450, 'universal', SLIDER_WIDTH, HANDLE_HALF, TICK_HALF, MAX_LEN))
      .toBe(450);
  });
});