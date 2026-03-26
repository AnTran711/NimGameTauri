<script setup>
import HeapCard from './HeapCard.vue';
import { useGameStore } from '@/stores/gameStore';
import { reactive, ref, watch } from 'vue';

const AI_PREVIEW_MS = 800;
const PICK_ANIMATION_MS = 240;

const aiSelectedStones = reactive({}); // { heapId: [index1, index2, ...] }
const pickingStones = reactive({}); // { heapId: [index1, index2, ...] }
const isPicking = ref(false);

const gameStore = useGameStore();

function toggleStone(heapId, stoneIndex) {
  if (isPicking.value) return;

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

async function confirmPick() {
  if (!gameStore.activeHeapId || isPicking.value) return;

  const heapId = gameStore.activeHeapId;
  const pickedIndexes = [...(gameStore.selectedStones[heapId] || [])];
  if (pickedIndexes.length === 0) return;

  isPicking.value = true;
  pickingStones[heapId] = pickedIndexes;

  await new Promise((resolve) => setTimeout(resolve, PICK_ANIMATION_MS));

  const heapIndex = gameStore.heaps.findIndex((h) => h.id === heapId);
  gameStore.makeMove(heapIndex, pickedIndexes.length);

  delete pickingStones[heapId];
  cancelSelection();
  isPicking.value = false;
}

// Hàm lấy ra các index của viên đá ở cuối đống để animation khi AI bốc
function getTailIndexes(total, removeCount) {
  // Ví dụ: total=5, removeCount=2 -> trả về [4, 5]
  const start = Math.max(1, total - removeCount + 1);
  return Array.from({ length: removeCount }, (_, i) => start + i);
}

// Watch biến pendingAIMove để khi có nước đi mới từ AI, thực hiện animation bốc đá
watch(
  () => gameStore.pendingAIMove,
  async (move) => {
    if (!move) return;

    const heap = gameStore.heaps[move.heapIndex];
    if (!heap) {
      gameStore.commitAIMove();
      return;
    }

    const indexes = getTailIndexes(heap.stones, move.removeCount);

    isPicking.value = true;

    // Bước 1: chỉ đổi trạng thái selected
    aiSelectedStones[move.heapId] = indexes;

    // Chờ để người chơi thấy đá được AI chọn
    await new Promise((resolve) => setTimeout(resolve, AI_PREVIEW_MS));

    // Bước 2: bắt đầu animation bốc
    pickingStones[move.heapId] = indexes;

    await new Promise((resolve) => setTimeout(resolve, PICK_ANIMATION_MS));

    gameStore.commitAIMove();

    delete pickingStones[move.heapId];
    delete aiSelectedStones[move.heapId];
    isPicking.value = false;
  }
);

function getSelectedStonesForHeap(heapId) {
  const playerSelected = gameStore.selectedStones[heapId] || [];
  const aiSelected = aiSelectedStones[heapId] || [];
  return [...new Set([...playerSelected, ...aiSelected])];
}

function handleToggleSelectAll(heapId, selectAll) {
  if (isPicking.value) return;

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
  <section class="board-panel">
    <h1 class="board-title">GAME BOARD</h1>
    <p class="board-sub">Chọn sỏi từ một đống để bốc.</p>

    <div class="heap-grid">
      <HeapCard
        v-for="heap in gameStore.heaps"
        :key="gameStore.gameRenderKey + '-' + heap.id"
        :heap="heap"
        :active-heap-id="gameStore.activeHeapId"
        :selected-stones="getSelectedStonesForHeap(heap.id)"
        :picked-stones="pickingStones[heap.id] || []"
        @toggle-stone="toggleStone"
        @toggle-select-all="handleToggleSelectAll"
      />
    </div>
  </section>
</template>

<style scoped>
.board-panel {
  width: 100%;
  height: 100%;
  background: #b87e35;
  border: 4px solid #3d200e;
  padding: 12px;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  display: flex;
  flex-direction: column;
}
.board-title {
  margin: 0;
  text-align: center;
  color: #fff;
  line-height: 1;
  font-size: 48px;
  text-shadow: 2px 2px 0 #6a3d11;
}
.board-sub {
  margin: 8px 0 0;
  text-align: center;
  color: #fff;
  font-size: 24px;
}
.heap-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  min-height: 390px;
  align-content: center;
}
@media (max-width: 1100px) {
  .heap-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 700px) {
  .heap-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
