import { describe, test, expect } from 'vitest';
import { isValidMove } from '../src/logic/validator';

describe('isValidMove', () => {
  test('nước đi hợp lệ', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ];

    expect(isValidMove(heaps, 1, 2)).toBe(true);
  });

  test('heap index không tồn tại', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ];

    expect(isValidMove(heaps, 5, 1)).toBe(false);
  });

  test('bốc quá số đá trong heap', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ];

    expect(isValidMove(heaps, 0, 5)).toBe(false);
  });

  test('số đá bốc <= 0', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ];

    expect(isValidMove(heaps, 1, 0)).toBe(false);
  });
});
