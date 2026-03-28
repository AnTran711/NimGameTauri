<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSavedGameStore } from '@/stores/savedGameStore';
import { useGameStore } from '@/stores/gameStore';
import PixelButton from '@/components/pixel/PixelButton.vue';
import { useDialog } from '@/composables/useDialog';

const dialog = useDialog();

const router = useRouter();
const savedGameStore = useSavedGameStore();
const gameStore = useGameStore();

onMounted(async () => {
  await savedGameStore.loadSavedGames();
});

async function loadGame(id) {
  const saved = await savedGameStore.getSavedGame(id);
  if (saved) {
    gameStore.importGameState(saved.gameState, id);
    router.push({
      path: '/game',
      query: {
        gameMode: saved.gameState.gameMode,
        variant: saved.gameState.variant,
        aiLevel: saved.gameState.aiLevel,
        loaded: 'true'
      }
    });
  }
}

async function deleteGame(id) {
  const ok = await dialog.confirm(
    'Bạn có chắc muốn xóa game này?',
    'Xác nhận xóa'
  );

  if (ok) {
    await savedGameStore.deleteSavedGame(id);
  }
}

function goHome() {
  router.push('/');
}

function getModeLabel(state) {
  if (state.gameMode === 'PVP') return 'Người vs Người';
  return 'Người vs Máy (' + (state.aiLevel === 'easy' ? 'Dễ' : 'Khó') + ')';
}

function getVariantLabel(state) {
  return state.variant === 'normal' ? 'Nim chuẩn' : 'Misère';
}
</script>

<template>
  <div class="saved-screen">
    <div class="saved-wrap">
      <header class="saved-header">
        <div class="saved-header-left">
          <PixelButton color="gray" class="back-btn" @click="goHome">
            Quay lại
          </PixelButton>
          <h1 class="saved-title">GAME ĐÃ LƯU</h1>
        </div>
        <div class="saved-count">
          Tổng số game: {{ savedGameStore.savedGames.length }}
        </div>
      </header>

      <main class="saved-main">
        <div v-if="savedGameStore.savedGames.length === 0" class="empty-box">
          <p class="empty-title">CHƯA CÓ BẢN GHI</p>
          <p class="empty-subtitle">
            Hãy chơi một ván game và lưu lại để xem tại đây.
          </p>
        </div>

        <div v-else class="saved-grid">
          <article
            v-for="game in savedGameStore.savedGames"
            :key="game.id"
            class="saved-card"
          >
            <div class="card-head">
              <p class="card-time">
                {{ new Date(game.timestamp).toLocaleString('vi-VN') }}
              </p>
            </div>

            <div class="card-info">
              <p>
                <span class="chip chip-blue">CHẾ ĐỘ</span>
                {{ getModeLabel(game.gameState) }}
              </p>
              <p>
                <span class="chip chip-red">QUY TẮC</span>
                {{ getVariantLabel(game.gameState) }}
              </p>
              <p>
                <span class="chip chip-yellow">SỐ NƯỚC ĐI</span>
                {{ game.gameState.historyMoves.length }}
              </p>
              <p class="heap-line">
                <span class="chip chip-brown">ĐỐNG</span>
                {{ game.gameState.heaps.map((h) => h.id).join(', ') }}
              </p>
            </div>

            <div class="card-actions">
              <PixelButton
                color="blue"
                class="action-btn"
                style="--pixel-text-nudge: -3px"
                @click="loadGame(game.id)"
              >
                Chơi tiếp
              </PixelButton>
              <PixelButton
                color="red"
                class="action-btn"
                style="--pixel-text-nudge: -3px"
                @click="deleteGame(game.id)"
              >
                Xóa
              </PixelButton>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.saved-screen {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(14, 9, 4, 0.45), rgba(14, 9, 4, 0.45)),
    url('/background-forest.jpg');
  background-size: cover;
  background-position: center;
  padding: 18px 12px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.saved-wrap {
  width: min(1200px, 100%);
  background: #9b6b2a;
  border: 6px solid #3d200e;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    8px 8px 0 rgba(0, 0, 0, 0.45);
  image-rendering: pixelated;
  padding: 14px;

  user-select: none;
  -webkit-user-select: none;
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: #b87e35;
  border: 4px solid #3d200e;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  padding: 10px;
}

.saved-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.saved-title {
  margin: 0;
  font-size: 36px;
  line-height: 1;
  color: #fff6d3;
  text-shadow: 2px 2px 0 #6a3d11;
  letter-spacing: 1px;
}

.saved-count {
  color: #ffe6c3;
  font-size: 28px;
  line-height: 1;
}

.back-btn {
  font-size: 24px;
  min-width: 130px;
  --pixel-text-nudge: -3px;
}

.saved-main {
  margin-top: 12px;
}

.empty-box {
  border: 4px solid #3d200e;
  background: #b87e35;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  text-align: center;
  padding: 32px 12px;
  color: #fff0d8;
}

.empty-title {
  margin: 0 0 8px 0;
  font-size: 36px;
  line-height: 1;
}

.empty-subtitle {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.saved-card {
  border: 4px solid #3d200e;
  background: #b87e35;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-head {
  border-bottom: 3px solid #3d200e;
  padding-bottom: 6px;
}

.card-time {
  margin: 0;
  color: #fff8dd;
  font-size: 24px;
  line-height: 1.15;
}

.card-info {
  color: #fff0d8;
  font-size: 24px;
  line-height: 1.2;
  display: grid;
  gap: 6px;
}

.card-info p {
  margin: 0;
}

.heap-line {
  word-break: break-word;
}

.chip {
  display: inline-block;
  min-width: 56px;
  text-align: center;
  border: 2px solid #3d200e;
  padding: 1px 4px;
  margin-right: 6px;
  color: #fff;
  line-height: 1;
  font-size: 20px;
}

.chip-blue {
  background: #2f79ff;
}

.chip-red {
  background: #d94848;
}

.chip-yellow {
  background: #bf9300;
}

.chip-brown {
  background: #8a5820;
}

.card-actions {
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.action-btn {
  width: 100%;
  justify-content: center;
  font-size: 20px;
  --pixel-text-nudge: -3px;
}

@media (max-width: 980px) {
  .saved-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .saved-screen {
    padding: 12px 8px;
  }

  .saved-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .saved-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }
}
</style>
