<script setup>
import AILevelModal from '@/components/AILevelModal.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PixelButton from '@/components/pixel/PixelButton.vue';

const router = useRouter();

const variant = ref('normal');
const gameMode = ref('PVP');
const aiLevel = ref('easy');
const showModal = ref(false);

const leafFallContainer = ref(null);
let leafTimer = null;

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

const goSavedGames = () => {
  router.push('/saved-games');
};

const goGuide = () => {
  router.push('/guide');
};

const goSettings = () => {
  router.push('/settings');
};

function createLeaf() {
  const container = leafFallContainer.value;
  if (!container) return;

  const leaf = document.createElement('div');
  leaf.classList.add('leaf');

  const duration = Math.random() * 2500 + 5500; // 5.5s - 8s
  const size = Math.random() * 14 + 18; // 18px - 32px

  // Spawn gần góc trên bên trái
  const startX = Math.random() * 440 - 40; // -40px -> 400px
  const startY = Math.random() * 140 - 90; // -90px -> 30px

  // Gió đẩy sang phải + dao động nhẹ
  const windPush = Math.random() * 180 + 120; // 120px -> 300px
  const sway = Math.random() * 30 + 15; // 15px -> 45px

  leaf.style.left = `${startX}px`;
  leaf.style.top = `${startY}px`;
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size}px`;
  leaf.style.animationDuration = `${duration}ms`;

  leaf.style.setProperty('--wind-push', `${windPush}px`);
  leaf.style.setProperty('--sway', `${sway}px`);

  container.appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, duration);
}

onMounted(() => {
  leafTimer = setInterval(createLeaf, 1500);
});

onUnmounted(() => {
  if (leafTimer) {
    clearInterval(leafTimer);
    leafTimer = null;
  }
});
</script>

<template>
  <div ref="leafFallContainer" class="leaf-fall-container"></div>
  <div class="center-wrapper">
    <!-- Title -->
    <div class="text-center mb-1">
      <h1 class="game-title">
        <span class="title-nim">NIM</span>
        <span class="title-game"> GAME</span>
      </h1>
    </div>

    <!-- Wooden Panel -->
    <div class="wooden-panel">
      <!-- Mode Section -->
      <div class="mode-box">
        <p class="mode-heading">CHẾ ĐỘ CHƠI</p>

        <hr class="border-t-2 border-white mb-3" />

        <label
          class="mode-row pixel-radio-row"
          :class="{ 'mode-row--active': variant === 'normal' }"
        >
          <input
            class="pixel-radio-input"
            type="radio"
            value="normal"
            v-model="variant"
          />
          <span class="pixel-radio-box" aria-hidden="true"></span>
          <div>
            <p class="mode-name">Chế độ thường</p>
            <p class="mode-desc">Người bốc cuối cùng sẽ THẮNG.</p>
          </div>
        </label>

        <label
          class="mode-row mt-1 pixel-radio-row"
          :class="{ 'mode-row--active': variant === 'misere' }"
        >
          <input
            class="pixel-radio-input"
            type="radio"
            value="misere"
            v-model="variant"
          />
          <span class="pixel-radio-box" aria-hidden="true"></span>
          <div>
            <p class="mode-name">Chế độ Misère</p>
            <p class="mode-desc">Người bốc cuối cùng sẽ THUA.</p>
          </div>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3 mt-5">
        <PixelButton color="blue" @click="clickPVP" class="action-btn">
          Người vs Người
        </PixelButton>
        <PixelButton color="green" @click="clickPVE" class="action-btn">
          Người vs Máy
        </PixelButton>
        <PixelButton color="yellow" @click="goSavedGames" class="action-btn">
          Trò chơi đã lưu
        </PixelButton>
        <PixelButton color="gray" @click="goGuide" class="action-btn">
          Hướng dẫn chơi
        </PixelButton>
        <PixelButton color="brown" @click="goSettings" class="action-btn">
          Cài đặt
        </PixelButton>
      </div>
    </div>
  </div>

  <AILevelModal :show="showModal" @select="selectLevel" @close="closeModal" />
</template>

<style scoped>
.center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  user-select: none;
  -webkit-user-select: none;
}

/* ── Title ──────────────────────────────────── */
.game-title {
  line-height: 1;
  letter-spacing: 2px;
  font-weight: bold;
}

.title-nim {
  font-size: 100px;
  color: #60c8ff;
  text-shadow:
    3px 3px 0 #0a4878,
    -2px -2px 0 #0a4878,
    2px -2px 0 #0a4878,
    -2px 2px 0 #0a4878;
}

.title-game {
  font-size: 100px;
  color: #f7d51d;
  text-shadow:
    3px 3px 0 #7a5700,
    -2px -2px 0 #7a5700,
    2px -2px 0 #7a5700,
    -2px 2px 0 #7a5700;
}

/* ── Wooden Panel ───────────────────────────── */
.wooden-panel {
  max-width: 600px;
  /* width: 600px; */
  background-color: #9b6b2a;
  border: 6px solid #3d200e;
  padding: 20px;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    5px 5px 0 rgba(0, 0, 0, 0.45);
  /* pixel corners */
  image-rendering: pixelated;
}

/* ── Mode Box ───────────────────────────────── */
.mode-box {
  color: #fff;
  line-height: 1;
  background-color: #b87e35;
  border: 3px solid #3d200e;
  padding: 14px;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
}

.mode-heading {
  font-size: 48px;
  text-align: center;
  margin-bottom: 14px;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 8px;
  border: 2px solid transparent;
  transition: background 0.1s;
}

.mode-row--active {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: #f7d51d;
}

.mode-name {
  font-size: 32px;
  margin-bottom: 4px;
}

.mode-desc {
  font-size: 24px;
  margin-bottom: 4px;
}

/* ── Pixel Radio Buttons ────────────────────── */
.pixel-radio-row {
  position: relative;
  gap: 12px;
}

.pixel-radio-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.pixel-radio-box {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border: 4px solid #3d200e;
  background: #eecb92;
  box-shadow:
    inset 2px 2px 0 #fbe4b8,
    inset -2px -2px 0 #8a5820;
  image-rendering: pixelated;
  position: relative;
}

.pixel-radio-input:checked + .pixel-radio-box {
  background: #f7d51d;
}

.pixel-radio-input:checked + .pixel-radio-box::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  left: 5px;
  top: 5px;
  background: #3d200e;
  box-shadow: 2px 2px 0 #8a5820;
}

.pixel-radio-input:focus-visible + .pixel-radio-box {
  outline: 3px solid #60c8ff;
  outline-offset: 2px;
}

/* ── Action Buttons ─────────────────────────── */
.action-btn {
  font-size: 32px;
  width: 100%;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -6px;
}

/* leaf fall */
.leaf-fall-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1000;
}

:deep(.leaf) {
  position: absolute;
  width: 30px;
  height: 30px;
  background-image: url('/leaf.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  animation-name: fallDiagonal;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  will-change: transform;
}

@keyframes fallDiagonal {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  35% {
    transform: translate(calc(20vw + var(--sway)), 35vh) rotate(120deg);
  }
  70% {
    transform: translate(calc(45vw - var(--sway)), 75vh) rotate(250deg);
  }
  100% {
    transform: translate(calc(70vw + var(--wind-push)), 115vh) rotate(360deg);
    opacity: 0.95;
  }
}
</style>
