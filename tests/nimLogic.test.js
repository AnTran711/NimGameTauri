import { describe, test, expect } from 'vitest';
import { isGameOver } from '../src/logic/nimLogic';
import { normalCheckWinner } from '../src/logic/nimLogic';
import { applyMove } from '../src/logic/nimLogic';

describe('isGameOver', () => {
  test('game chưa kết thúc', () => {
    const heaps = [
      { id: 1, stones: 0 },
      { id: 2, stones: 1 },
      { id: 3, stones: 0 },
    ];

    expect(isGameOver(heaps)).toBe(false);
  });

  test('game kết thúc', () => {
    const heaps = [
      { id: 1, stones: 0 },
      { id: 2, stones: 0 },
      { id: 3, stones: 0 },
    ];

    expect(isGameOver(heaps)).toBe(true);
  });
});

describe('normalCheckWinner', () => {
  test('người đi cuối cùng thắng', () => {
    const heaps = [
      { id: 1, stones: 0 },
      { id: 2, stones: 0 },
      { id: 3, stones: 0 },
    ];

    expect(normalCheckWinner(heaps, 1)).toBe(1);
  });
});

describe('applyMove', () => {
  test('áp dụng nước đi hợp lệ', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ];
    expect(applyMove(heaps, 1, 2)).toEqual([
      { id: 1, stones: 3 },
      { id: 2, stones: 2 },
      { id: 3, stones: 5 },
    ]);
  });
});
