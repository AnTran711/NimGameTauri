<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSavedGameStore } from '@/stores/savedGameStore';
import { useGameStore } from '@/stores/gameStore';

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
  if (confirm('Bạn có chắc muốn xóa game này?')) {
    await savedGameStore.deleteSavedGame(id);
  }
}

function goHome() {
  router.push('/');
}

function getModeLabel(state) {
  if (state.gameMode === 'PVP') return 'Người vs Người';
  return `Người vs Máy (${state.aiLevel === 'easy' ? 'Dễ' : 'Khó'})`;
}

function getVariantLabel(state) {
  return state.variant === 'normal' ? 'Nim chuẩn' : 'Misère';
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Header -->
    <header
      class="h-16 bg-white border-b flex items-center justify-between px-6"
    >
      <div class="flex items-center gap-3">
        <button
          @click="goHome"
          class="px-3 py-2 rounded-lg hover:bg-slate-100 transition text-sm"
        >
          ← Quay lại
        </button>
        <span class="text-lg font-semibold">📂 Game đã lưu</span>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 px-10 py-8">
      <div
        v-if="savedGameStore.savedGames.length === 0"
        class="text-center text-gray-400 mt-20 text-lg"
      >
        Chưa có game nào được lưu
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="game in savedGameStore.savedGames"
          :key="game.id"
          class="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition"
        >
          <!-- Tên game & thời gian -->
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-gray-800">
                {{ new Date(game.timestamp).toLocaleString('vi-VN') }}
              </h3>
            </div>
          </div>

          <!-- Thông tin game -->
          <div class="space-y-1 text-sm text-gray-600 mb-4">
            <div>🎮 {{ getModeLabel(game.gameState) }}</div>
            <div>📋 {{ getVariantLabel(game.gameState) }}</div>
            <div>📊 Số nước đi: {{ game.gameState.historyMoves.length }}</div>
            <div>
              🗂️ Danh sách đống đá:
              {{ game.gameState.heaps.map((h) => h.id).join(', ') }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="loadGame(game.id)"
              class="w-50 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              ▶ Chơi tiếp
            </button>
            <button
              @click="deleteGame(game.id)"
              class="w-50 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 transition"
            >
              🗑 Xóa
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
