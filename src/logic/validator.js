export function isValidMove(heaps, heapIndex, removeCount) {
  if (!Array.isArray(heaps)) return false;
  if (!Number.isInteger(heapIndex)) return false;
  if (!Number.isInteger(removeCount)) return false;

  if (heapIndex < 0 || heapIndex >= heaps.length) return false;
  if (removeCount <= 0 || removeCount > heaps[heapIndex].stones) return false;

  return true;
}
