import { describe, test, expect } from 'vitest';
import { getHardMove } from '../src/ai/index';

// Helper: áp dụng nước đi để tính nimSum mới
function applyMove(heaps, move) {
  const newHeaps = [...heaps];
  newHeaps[move.heapIndex].stones -= move.removeCount;
  return newHeaps;
}

// Helper: tính nimSum (để verify)
function calculateNimSum(heaps) {
  return heaps.reduce((sum, h) => sum ^ h.stones, 0);
}

describe('AI Hard - Normal Nim', () => {
  test('nimSum != 0 -> AI đưa về nimSum = 0', () => {
    const heaps = [
      { id: 1, stones: 3 },
      { id: 2, stones: 4 },
      { id: 3, stones: 5 },
    ]; // nimSum = 3 ^ 4 ^ 5 = 2

    const move = getHardMove(heaps, 'normal');

    const newHeaps = applyMove(heaps, move);
    const newNimSum = calculateNimSum(newHeaps);

    expect(newNimSum).toBe(0);
  });

  test('nimSum = 0 -> AI vẫn trả về nước đi hợp lệ', () => {
    const heaps = [
      { id: 1, stones: 1 },
      { id: 2, stones: 2 },
      { id: 3, stones: 3 },
    ]; // nimSum = 0

    const move = getHardMove(heaps, 'normal');

    expect(move).toHaveProperty('heapIndex');
    expect(move).toHaveProperty('removeCount');
    expect(move.heapIndex).toBeGreaterThanOrEqual(0);
    expect(move.removeCount).toBeGreaterThan(0);
  });
});

describe('AI Hard - Misere Nim', () => {
  test('chỉ còn 1 heap > 1 -> xử lý theo luật misere', () => {
    const heaps = [
      { id: 1, stones: 1 },
      { id: 2, stones: 1 },
      { id: 3, stones: 5 },
    ];

    const move = getHardMove(heaps, 'misere');

    // phải lấy từ heap có >1 viên
    expect(move.heapIndex).toBe(2);

    // sau khi đi, heap đó còn 1 hoặc 0
    const remaining = heaps[2].stones - move.removeCount;
    expect([0, 1]).toContain(remaining);
  });

  test('nhiều hơn 1 heap > 1 -> chơi như Nim thường', () => {
    const heaps = [
      { id: 1, stones: 2 },
      { id: 2, stones: 3 },
      { id: 3, stones: 4 },
    ];

    const move = getHardMove(heaps, 'misere');

    const newHeaps = applyMove(heaps, move);
    const newNimSum = calculateNimSum(newHeaps);

    expect(newNimSum).toBe(0);
  });

  test('toàn bộ heap = 1 → bốc 1 viên bất kỳ', () => {
    const heaps = [
      { id: 1, stones: 1 },
      { id: 2, stones: 1 },
      { id: 3, stones: 1 },
    ];

    const move = getHardMove(heaps, 'misere');

    expect(move.removeCount).toBe(1);
    expect(move.heapIndex).toBeGreaterThanOrEqual(0);
  });
});
