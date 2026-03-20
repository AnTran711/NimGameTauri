import { isValidMove } from './validator';

// Hàm thực hiện nước đi
export function applyMove(heaps, heapIndex, removeCount) {
  if (!isValidMove(heaps, heapIndex, removeCount)) {
    throw new Error('Invalid move');
  }

  return heaps.map((heap, index) =>
    index === heapIndex ? { ...heap, stones: heap.stones - removeCount } : heap
  );
}

// Hàm kiểm tra trạng thái kết thúc game
export function isGameOver(heaps) {
  return heaps.every((h) => h.stones === 0);
}

// Hàm xác định người thắng trong chế độ normal
export function normalCheckWinner(heaps, currentPlayer) {
  if (!isGameOver(heaps)) return null;

  return currentPlayer;
}
