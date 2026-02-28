import { isValidMove } from '../logic/validator';
import { randomInt } from '../tools/random';

export function getEasyMove(heaps) {
  const validHeaps = heaps
    .map((data, index) => ({ data, index }))
    .filter((h) => h.data.stones > 0);

  let chosenHeap, removeCount;

  do {
    chosenHeap = validHeaps[randomInt(0, validHeaps.length - 1)];

    removeCount = randomInt(1, chosenHeap.data.stones);
  } while (!isValidMove(heaps, chosenHeap.index, removeCount));

  return {
    heapIndex: chosenHeap.index,
    removeCount,
  };
}
