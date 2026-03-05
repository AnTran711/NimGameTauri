<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import GameHeader from '@/components/GameHeader.vue';
import GameBoard from '@/components/GameBoard.vue';
import GameFooter from '@/components/GameFooter.vue';
import WinnerModal from '@/components/WinnerModal.vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import HistoryMovesDrawer from '@/components/HistoryMovesDrawer.vue';
import { useSavedGameStore } from '../stores/savedGameStore';

const isHistoryOpen = ref(false);

const openMoveDrawer = () => {
  isHistoryOpen.value = true;
};

const gameStore = useGameStore();
const savedGameStore = useSavedGameStore();

const route = useRoute();
const router = useRouter();

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

// === Xử lý lưu game ===

async function saveCurrentGame() {
  const state = gameStore.exportGameState();
  await savedGameStore.saveGame(state);
  gameStore.isChanged = false;
  alert('Lưu game thành công');
  goHome();
}

// Hỏi lưu khi rời trang (chuyển route)
onBeforeRouteLeave(async (to, from, next) => {
  if (
    gameStore.isGameInProgress() &&
    !savedGameStore.hasSaved &&
    gameStore.isChanged
  ) {
    const answer = confirm(
      'Bạn đang chơi dở ván game. Bạn có muốn lưu lại không?'
    );
    if (answer) {
      await saveCurrentGame();
    } else {
      const gameActiveIdx = savedGameStore.savedGames.findIndex(
        (g) => g.isActive === true
      );
      if (gameActiveIdx !== -1) {
        savedGameStore.savedGames[gameActiveIdx].isActive = false;
        await savedGameStore.writeSavedGames();
      }
    }
  }
  next();
});

// Hỏi lưu khi đóng app / reload tab
function handleBeforeUnload(e) {
  if (
    gameStore.isGameInProgress() &&
    !savedGameStore.hasSaved &&
    gameStore.isChanged
  ) {
    e.preventDefault();
    e.returnValue = '';
  }
}

onMounted(() => {
  // Nếu là game loaded từ saved games thì không startNewGame
  if (route.query.loaded === 'true') {
    // Game đã được import vào store rồi, không cần làm gì
  } else {
    gameStore.startNewGame(getDataFromURL());
  }

  savedGameStore.hasSaved = false;

  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <GameHeader
      :current-player="gameStore.currentPlayer"
      :game-mode="gameStore.gameMode"
      :variant="gameStore.variant"
      :ai-level="gameStore.aiLevel"
      @open-move-drawer="openMoveDrawer"
      @save-game="saveCurrentGame"
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
