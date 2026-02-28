<script setup>
import AILevelModal from '@/components/AILevelModal.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const variant = ref('normal');
const gameMode = ref('PVP');
const aiLevel = ref('easy');

const showModal = ref(false);

const selectLevel = (level) => {
  aiLevel.value = level;

  startNewGame();
};

const clickPVP = () => {
  gameMode.value = 'PVP';
  startNewGame();
};

const clickPVE = () => {
  gameMode.value = 'PVE';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const startNewGame = () => {
  router.push({
    path: '/game',
    query: {
      variant: variant.value,
      gameMode: gameMode.value,
      aiLevel: aiLevel.value
    }
  });
};

const goGuide = () => {
  router.push('/guide');
};
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center"
  >
    <!-- Main Card -->
    <div class="w-105 bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div
        class="bg-linear-to-br from-blue-500 to-blue-600 text-white text-center py-8 px-6 relative"
      >
        <h1 class="text-3xl font-bold mb-2 tracking-wide">NIM GAME</h1>
        <p class="text-blue-100 text-sm">
          Trò chơi chiến thuật toán học kinh điển
        </p>

        <!-- Decorative dots -->
        <div
          class="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]"
        ></div>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- Mode Section -->
        <div>
          <p class="text-sm font-semibold text-gray-500 mb-3 tracking-wide">
            CHẾ ĐỘ CHƠI
          </p>

          <div class="space-y-3">
            <!-- Normal Mode -->
            <label
              class="flex items-center gap-3 py-2 px-4 rounded-xl border cursor-pointer transition"
              :class="
                mode === 'normal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              "
            >
              <input
                type="radio"
                class="mt-1 accent-blue-500 scale-150"
                value="normal"
                v-model="variant"
              />

              <div>
                <p class="font-semibold text-gray-800">Chế độ thường</p>
                <p class="text-sm text-gray-500">
                  Người bốc cuối cùng sẽ
                  <span class="text-blue-600 font-medium">THẮNG</span>.
                </p>
              </div>
            </label>

            <!-- Misère Mode -->
            <label
              class="flex items-center gap-3 py-2 px-4 rounded-xl border cursor-pointer transition"
              :class="
                mode === 'misere'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              "
            >
              <input
                type="radio"
                class="mt-1 accent-blue-500 scale-150"
                value="misere"
                v-model="variant"
              />

              <div>
                <p class="font-semibold text-gray-800">Chế độ Misère</p>
                <p class="text-sm text-gray-500">
                  Người bốc cuối cùng sẽ
                  <span class="text-red-500 font-medium">THUA</span>.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Divider -->
        <hr class="border-gray-200" />

        <!-- Buttons -->
        <div class="space-y-4">
          <!-- PvP -->
          <button
            @click="clickPVP"
            class="w-full flex items-center justify-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Người vs Người
          </button>

          <!-- PvE -->
          <button
            @click="clickPVE"
            class="w-full flex items-center justify-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Người vs Máy
          </button>

          <!-- Guide -->
          <button
            @click="goGuide"
            class="w-full flex items-center justify-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
              />
            </svg>
            Hướng dẫn chơi
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal AI Level -->
  <AILevelModal :show="showModal" @select="selectLevel" @close="closeModal" />
</template>
