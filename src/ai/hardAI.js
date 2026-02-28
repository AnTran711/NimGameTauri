function calculateNimSum(heaps) {
  return heaps.reduce((sum, h) => sum ^ h.stones, 0);
}

// Hàm tính nước đi tối ưu cho chế độ Normal
function getOptimalNormalMove(heaps) {
  const nimSum = calculateNimSum(heaps);

  // Nếu nimSum = 0 thì đang ở thế thua, nên sẽ đi đại
  if (nimSum === 0) {
    for (let i = 0; i < heaps.length; i++) {
      if (heaps[i].stones > 0) return { heapIndex: i, removeCount: 1 };
    }
  }

  // Trường hợp còn lại nimSum > 0, đang ở thế thắng nên sẽ chơi tối ưu
  for (let i = 0; i < heaps.length; i++) {
    const target = heaps[i].stones ^ nimSum;
    if (target < heaps[i].stones) {
      return {
        heapIndex: i,
        removeCount: heaps[i].stones - target,
      };
    }
  }
}

// Hàm tính nước đi tối ưu cho chế độ Misere
function getOptimalMisereMove(heaps) {
  // Tính số lượng đống có số sỏi lớn hơn 1 viên
  const heapsGreaterThanOne = heaps.filter((h) => h.stones > 1).length;

  // Trường hợp chỉ còn một đống sỏi lớn hơn 1 viên, lúc này chỉ cần làm cho số
  // đống sỏi có 1 viên là số lẻ sẽ chắc chắn thắng
  if (heapsGreaterThanOne === 1) {
    const heapsEqualOne = heaps.filter((h) => h.stones === 1).length;
    const heapIndex = heaps.findIndex((h) => h.stones > 1);

    const removeCount =
      heapsEqualOne % 2 === 0
        ? heaps[heapIndex].stones - 1
        : heaps[heapIndex].stones;

    return { heapIndex, removeCount };
  }

  // Trường hợp còn nhiều hơn một đống sỏi lớn hơn 1 viên, lúc này sẽ chơi như Nim bình thường
  if (heapsGreaterThanOne > 1) {
    return getOptimalNormalMove(heaps);
  }

  // Trường hợp toàn bộ đống sỏi chỉ còn 1 viên, bốc đại
  const firstNonEmpty = heaps.findIndex((h) => h.stones > 0);
  if (firstNonEmpty !== -1) {
    return { heapIndex: firstNonEmpty, removeCount: 1 };
  }

  return { heapIndex: -1, removeCount: 0 };
}

export function getHardMove(heaps, variant = 'normal') {
  return variant === 'normal'
    ? getOptimalNormalMove(heaps)
    : getOptimalMisereMove(heaps);
}
