import { randomInt } from '@/tools/random';

export function initHeaps({
  minHeaps = 3,
  maxHeaps = 10,
  minStones = 3,
  maxStones = 10,
} = {}) {
  const heapCount = randomInt(minHeaps, maxHeaps);

  return Array.from({ length: heapCount }, (_, i) => ({
    id: i + 1,
    stones: randomInt(minStones, maxStones),
  }));
}
