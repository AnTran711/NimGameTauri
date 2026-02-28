<script setup>
import HeapCard from './HeapCard.vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

function toggleStone(heapId, stoneIndex) {
  // nếu chưa chọn đống nào -> set đống hiện tại
  if (gameStore.activeHeapId === null) {
    gameStore.activeHeapId = heapId;
    gameStore.selectedStones[heapId] = [];
  }

  // nếu click sang đống khác khi đang chọn -> chặn
  if (gameStore.activeHeapId !== heapId) return;

  // khởi tạo mảng nếu chưa có
  if (!gameStore.selectedStones[heapId]) {
    gameStore.selectedStones[heapId] = [];
  }

  const idx = gameStore.selectedStones[heapId].indexOf(stoneIndex);

  if (idx === -1) {
    // thêm viên đá vào danh sách chọn
    gameStore.selectedStones[heapId].push(stoneIndex);
  } else {
    // bỏ chọn viên đá
    gameStore.selectedStones[heapId].splice(idx, 1);
  }

  // nếu bỏ chọn hết -> mở khóa các đống khác
  if (gameStore.selectedStones[heapId].length === 0) {
    gameStore.activeHeapId = null;
    delete gameStore.selectedStones[heapId];
  }
}

function cancelSelection() {
  gameStore.activeHeapId = null;
  gameStore.selectedStones = {};
}

function confirmPick() {
  if (!gameStore.activeHeapId) return;

  // lấy số lượng đá đã chọn
  const selectedCount =
    gameStore.selectedStones[gameStore.activeHeapId]?.length || 0;

  if (selectedCount === 0) return;

  // tìm đống và giảm số đá
  const heapIndex = gameStore.heaps.indexOf(
    gameStore.heaps.find((h) => h.id === gameStore.activeHeapId)
  );

  gameStore.makeMove(heapIndex, selectedCount);

  // reset trạng thái chọn
  cancelSelection();
}

function getSelectedStonesForHeap(heapId) {
  return gameStore.selectedStones[heapId] || [];
}

function handleToggleSelectAll(heapId, selectAll) {
  const heap = gameStore.heaps.find((h) => h.id === heapId);
  if (heap) {
    if (selectAll) {
      // Chọn tất cả
      gameStore.selectedStones[heapId] = Array.from(
        { length: heap.stones },
        (_, i) => i + 1
      );
      gameStore.activeHeapId = heapId;
    } else {
      // Bỏ chọn tất cả
      cancelSelection();
    }
  }
}

// Expose methods để component cha có thể gọi
defineExpose({
  cancelSelection,
  confirmPick
});
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold text-center">Game Board</h1>
    <p class="text-center text-slate-500 mt-1">
      Chọn sỏi từ một đống bất kỳ để bốc.
    </p>

    <div class="mt-10 grid grid-cols-5 gap-6">
      <HeapCard
        v-for="heap in gameStore.heaps"
        :key="heap.id"
        :heap="heap"
        :active-heap-id="gameStore.activeHeapId"
        :selected-stones="getSelectedStonesForHeap(heap.id)"
        @toggle-stone="toggleStone"
        @toggle-select-all="handleToggleSelectAll"
      />
    </div>
  </section>
</template>
