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
import { useDialog } from '@/composables/useDialog';

const dialog = useDialog();

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

async function saveCurrentGame({ redirectHome = true } = {}) {
  const state = gameStore.exportGameState();
  const savedId = await savedGameStore.saveGame(state, gameStore.currentGameId);

  if (!savedId) {
    await dialog.alert('Lưu game thất bại', 'Lỗi');
    return;
  }

  gameStore.currentGameId = savedId;
  gameStore.isChanged = false;
  await dialog.alert('Lưu game thành công', 'Thành công');

  if (redirectHome) {
    goHome();
  }
}

// Hỏi lưu khi rời trang (chuyển route)
onBeforeRouteLeave(async (to, from, next) => {
  if (gameStore.isGameInProgress() && gameStore.isChanged) {
    const answer = await dialog.confirm(
      'Bạn đang chơi dở ván game. Bạn có muốn lưu lại không?',
      'Xác nhận lưu game'
    );

    if (answer) {
      await saveCurrentGame({ redirectHome: false });
    }
  }
  next();
});

// Hỏi lưu khi đóng app / reload tab
function handleBeforeUnload(e) {
  if (gameStore.isGameInProgress() && gameStore.isChanged) {
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

  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="board-screen">
    <div class="board-shell">
      <GameHeader
        :current-player="gameStore.currentPlayer"
        :game-mode="gameStore.gameMode"
        :variant="gameStore.variant"
        :ai-level="gameStore.aiLevel"
        @open-move-drawer="openMoveDrawer"
        @save-game="saveCurrentGame"
      />

      <main class="board-main">
        <GameBoard ref="gameBoardRef" />
      </main>

      <GameFooter
        :game-mode="gameStore.gameMode"
        :current-player="gameStore.currentPlayer"
        @cancel="handleCancelSelection"
        @confirm="handleConfirmPick"
      />
    </div>
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

<style scoped>
.board-screen {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(14, 9, 4, 0.45), rgba(14, 9, 4, 0.45)),
    url('/backgound-forest.jpg');
  background-size: cover;
  background-position: center;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.board-shell {
  width: min(1440px, 100%);
  height: min(722px, calc(100vh - 32px));
  margin: 0 auto;
  background: #9b6b2a;
  border: 6px solid #3d200e;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    8px 8px 0 rgba(0, 0, 0, 0.45);
  image-rendering: pixelated;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  user-select: none;
  -webkit-user-select: none;
}

.board-main {
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
