<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PixelButton from '@/components/pixel/PixelButton.vue';
import { useMusicStore } from '@/stores/musicStore';
import { useGameSettingsStore } from '@/stores/gameSettingsStore';

const MIN_LIMIT = 3;
const MAX_LIMIT = 10;

const router = useRouter();
const musicStore = useMusicStore();
const gameSettingsStore = useGameSettingsStore();

const bgmPercent = computed(() => Math.round(musicStore.bgmVolume * 100));
const sfxPercent = computed(() => Math.round(musicStore.sfxVolume * 100));

function goHome() {
  router.push('/');
}

function onBgmInput(event) {
  const value = Number(event.target.value);
  musicStore.setBgmVolume(value / 100);
}

function onSfxInput(event) {
  const value = Number(event.target.value);
  musicStore.setSfxVolume(value / 100);
}

function changeMinHeaps(step) {
  const next = gameSettingsStore.minHeaps + step;
  gameSettingsStore.setMinHeaps(next);
}

function changeMaxHeaps(step) {
  const next = gameSettingsStore.maxHeaps + step;
  gameSettingsStore.setMaxHeaps(next);
}

function changeMinStones(step) {
  const next = gameSettingsStore.minStones + step;
  gameSettingsStore.setMinStones(next);
}

function changeMaxStones(step) {
  const next = gameSettingsStore.maxStones + step;
  gameSettingsStore.setMaxStones(next);
}

function canDecrease(value) {
  return value > MIN_LIMIT;
}

function canIncrease(value) {
  return value < MAX_LIMIT;
}
</script>

<template>
  <div class="setting-screen">
    <div class="setting-wrap">
      <header class="setting-header">
        <div class="setting-header-left">
          <PixelButton color="gray" class="back-btn" @click="goHome">
            Quay lại
          </PixelButton>
          <h1 class="setting-title">CÀI ĐẶT</h1>
        </div>
      </header>

      <main class="setting-main">
        <section class="setting-card">
          <h2 class="card-title">ÂM THANH</h2>

          <div class="slider-row">
            <div class="slider-label-wrap">
              <p class="slider-label">Nhạc nền (BGM)</p>
              <span class="slider-value">{{ bgmPercent }}%</span>
            </div>
            <input
              class="pixel-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              :value="bgmPercent"
              @input="onBgmInput"
            />
          </div>

          <div class="slider-row">
            <div class="slider-label-wrap">
              <p class="slider-label">Hiệu ứng (SFX)</p>
              <span class="slider-value">{{ sfxPercent }}%</span>
            </div>
            <input
              class="pixel-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              :value="sfxPercent"
              @input="onSfxInput"
            />
          </div>
        </section>

        <section class="setting-card">
          <h2 class="card-title">RANDOM ĐỐNG ĐÁ</h2>

          <div class="setting-grid">
            <div class="stepper-row">
              <p class="stepper-label">Số đống đá tối thiểu</p>
              <div class="stepper-box">
                <PixelButton
                  color="red"
                  class="step-btn"
                  :disabled="!canDecrease(gameSettingsStore.minHeaps)"
                  @click="changeMinHeaps(-1)"
                >
                  -
                </PixelButton>
                <div class="step-value">{{ gameSettingsStore.minHeaps }}</div>
                <PixelButton
                  color="green"
                  class="step-btn"
                  :disabled="!canIncrease(gameSettingsStore.minHeaps)"
                  @click="changeMinHeaps(1)"
                >
                  +
                </PixelButton>
              </div>
            </div>

            <div class="stepper-row">
              <p class="stepper-label">Số đống đá tối đa</p>
              <div class="stepper-box">
                <PixelButton
                  color="red"
                  class="step-btn"
                  :disabled="!canDecrease(gameSettingsStore.maxHeaps)"
                  @click="changeMaxHeaps(-1)"
                >
                  -
                </PixelButton>
                <div class="step-value">{{ gameSettingsStore.maxHeaps }}</div>
                <PixelButton
                  color="green"
                  class="step-btn"
                  :disabled="!canIncrease(gameSettingsStore.maxHeaps)"
                  @click="changeMaxHeaps(1)"
                >
                  +
                </PixelButton>
              </div>
            </div>

            <div class="stepper-row">
              <p class="stepper-label">Đá mỗi đống tối thiểu</p>
              <div class="stepper-box">
                <PixelButton
                  color="red"
                  class="step-btn"
                  :disabled="!canDecrease(gameSettingsStore.minStones)"
                  @click="changeMinStones(-1)"
                >
                  -
                </PixelButton>
                <div class="step-value">{{ gameSettingsStore.minStones }}</div>
                <PixelButton
                  color="green"
                  class="step-btn"
                  :disabled="!canIncrease(gameSettingsStore.minStones)"
                  @click="changeMinStones(1)"
                >
                  +
                </PixelButton>
              </div>
            </div>

            <div class="stepper-row">
              <p class="stepper-label">Đá mỗi đống tối đa</p>
              <div class="stepper-box">
                <PixelButton
                  color="red"
                  class="step-btn"
                  :disabled="!canDecrease(gameSettingsStore.maxStones)"
                  @click="changeMaxStones(-1)"
                >
                  -
                </PixelButton>
                <div class="step-value">{{ gameSettingsStore.maxStones }}</div>
                <PixelButton
                  color="green"
                  class="step-btn"
                  :disabled="!canIncrease(gameSettingsStore.maxStones)"
                  @click="changeMaxStones(1)"
                >
                  +
                </PixelButton>
              </div>
            </div>
          </div>

          <p class="hint">
            Giới hạn hiện tại: từ {{ MIN_LIMIT }} đến {{ MAX_LIMIT }}.
          </p>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.setting-screen {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(14, 9, 4, 0.45), rgba(14, 9, 4, 0.45)),
    url('/background-forest.jpg');
  background-size: cover;
  background-position: center;
  padding: 18px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-wrap {
  width: min(1100px, 100%);
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

.setting-header {
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

.setting-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.setting-title {
  margin: 0;
  font-size: 36px;
  line-height: 1;
  color: #fff6d3;
  text-shadow: 2px 2px 0 #6a3d11;
  letter-spacing: 1px;
}

.back-btn {
  font-size: 24px;
  min-width: 130px;
  --pixel-text-nudge: -3px;
}

.setting-main {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.setting-card {
  border: 4px solid #3d200e;
  background: #b87e35;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  padding: 12px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 32px;
  line-height: 1;
  color: #fff4d7;
  text-shadow: 2px 2px 0 #6a3d11;
}

.slider-row {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.slider-row:last-child {
  margin-bottom: 0;
}

.slider-label-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: #fff0d8;
}

.slider-label {
  margin: 0;
  font-size: 24px;
  line-height: 1;
}

.slider-value {
  font-size: 24px;
  line-height: 1;
  color: #f7d51d;
}

.pixel-slider {
  width: 100%;
  accent-color: #2f79ff;
  height: 16px;
  cursor: pointer;
}

.setting-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stepper-row {
  border: 3px solid #3d200e;
  background: #9d6a2f;
  padding: 10px;
  box-shadow:
    inset 2px 2px 0 #c7904e,
    inset -2px -2px 0 #74471e;
}

.stepper-label {
  margin: 0 0 8px 0;
  font-size: 22px;
  line-height: 1.15;
  color: #fff0d8;
}

.stepper-box {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
}

.step-btn {
  width: 52px;
  height: 48px;
  font-size: 28px;
  line-height: 1;
  --pixel-text-nudge: -4px;
  justify-content: center;
}

.step-value {
  border: 4px solid #3d200e;
  background: #eecb92;
  box-shadow:
    inset 2px 2px 0 #fbe4b8,
    inset -2px -2px 0 #8a5820;
  text-align: center;
  padding: 8px 10px;
  min-height: 30px;
  font-size: 30px;
  line-height: 1;
  color: #3d200e;
}

.hint {
  margin: 12px 0 0;
  font-size: 20px;
  line-height: 1.2;
  color: #ffe2bf;
}

@media (max-width: 860px) {
  .setting-grid {
    grid-template-columns: 1fr;
  }

  .setting-title {
    font-size: 30px;
  }

  .card-title {
    font-size: 28px;
  }
}
</style>
