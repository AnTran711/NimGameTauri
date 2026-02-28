import { isGameOver } from './nimLogic';

// Hàm xác định người thắng trong chế độ biến thể misere
export function misereCheckWinner(heaps, currentPlayer) {
  if (!isGameOver(heaps)) return null;

  return currentPlayer === 1 ? 2 : 1;
}
