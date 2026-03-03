<script setup>
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import GameHeader from '@/components/GameHeader.vue';
import GameBoard from '@/components/GameBoard.vue';
import GameFooter from '@/components/GameFooter.vue';
import WinnerModal from '@/components/WinnerModal.vue';
import { useRoute, useRouter } from 'vue-router';
import HistoryMovesDrawer from '@/components/HistoryMovesDrawer.vue';

const isHistoryOpen = ref(false);

const openMoveDrawer = () => {
  isHistoryOpen.value = true;
};

const gameStore = useGameStore();

const route = useRoute();
const router = useRouter();

onMounted(() => {
  gameStore.startNewGame(getDataFromURL());
});

const getDataFromURL = () => {
  const mode = route.query.gameMode;
  const vra = route.query.variant;
  const level = route.query.aiLevel;
  const params = { mode, vra, level };
  return params;
};

const gameBoardRef = ref(null);

function handleCancelSelection() {
  gameBoardRef.value?.cancelSelection();
}

function handleConfirmPick() {
  gameBoardRef.value?.confirmPick();
}

function replay() {
  gameStore.startNewGame(getDataFromURL());
}

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <GameHeader
      :current-player="gameStore.currentPlayer"
      :game-mode="gameStore.gameMode"
      :variant="gameStore.variant"
      :ai-level="gameStore.aiLevel"
      @open-move-drawer="openMoveDrawer"
    />

    <main class="flex-1 px-10 py-8">
      <GameBoard ref="gameBoardRef" />
    </main>

    <GameFooter
      :game-mode="gameStore.gameMode"
      :current-player="gameStore.currentPlayer"
      @cancel="handleCancelSelection"
      @confirm="handleConfirmPick"
    />
  </div>

  <WinnerModal
    :show="gameStore.gameOver"
    :winner="
      gameStore.gameMode === 'PVP'
        ? `Người chơi ${gameStore.winner}`
        : gameStore.winner === 1
          ? 'Người'
          : 'Máy'
    "
    @replay="replay"
    @close="goHome"
  />

  <HistoryMovesDrawer :is-open="isHistoryOpen" @close="isHistoryOpen = false" />
</template>
