import { describe, test, expect } from 'vitest';
import { misereCheckWinner } from '../src/logic/misereLogic';

describe('misereCheckWinner', () => {
  test('người đi cuối cùng thua', () => {
    const heaps = [
      { id: 1, stones: 0 },
      { id: 2, stones: 0 },
      { id: 3, stones: 0 },
    ];

    expect(misereCheckWinner(heaps, 1)).toBe(2);
  });
});
