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

function onThemeToggle() {
  gameSettingsStore.toggleTheme();
}
</script>

<template>
  <div class="setting-wrap">
    <header class="setting-header">
      <div class="setting-header-left">
        <PixelButton color="gray" class="back-btn" @click="goHome">
          Quay lại
        </PixelButton>
        <h1 class="setting-title">CÀI ĐẶT</h1>
      </div>

      <div class="theme-switch-wrap">
        <div class="px-icon-theme px-icon-theme--sun" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 22H4v-2h10v2ZM4 20H2v-4h2v4Zm12 0h-2v-4h2v4Zm-6-2H8v-2h2v2Zm-2-2H4v-2h4v2Zm6 0h-2v-2h2v2Zm-2-2H8v-2h4v2Zm12-1h-4v-2h4v2Zm-6-1h-2v-2h2v2ZM8 10H6V8h2v2Zm8 0h-2V8h2v2Zm-2-2H8V6h6v2ZM6 6H4V4h2v2Zm14 0h-2V4h2v2ZM4 4H2V2h2v2Zm9 0h-2V0h2v4Zm9 0h-2V2h2v2Z"
            />
          </svg>
        </div>

        <label
          class="theme-toggle"
          :aria-label="
            gameSettingsStore.isDarkTheme ? 'Dark mode' : 'Light mode'
          "
        >
          <input
            class="theme-toggle-input"
            type="checkbox"
            :checked="gameSettingsStore.isDarkTheme"
            @change="onThemeToggle"
          />
          <span class="theme-toggle-track"></span>
          <span class="theme-toggle-thumb"></span>
        </label>

        <div class="px-icon-theme px-icon-theme--moon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 22H8v-2h10v2ZM8 20H6v-2h2v2Zm12 0h-2v-2h2v2ZM6 18H4v-2h2v2Zm16 0h-2v-4h-2v-2h2v-2h2v8ZM4 16H2V6h2v10Zm14 0h-6v-2h6v2Zm-6-2h-2v-2h2v2Zm-2-2H8V6h2v6ZM6 6H4V4h2v2Zm8-2h-2v2h-2V4H6V2h8v2Z"
            />
          </svg>
        </div>
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
</template>

<style scoped>
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
  flex: 1;
  min-width: 0;
}

.theme-switch-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border: 3px solid #3d200e;
  background: #9d6a2f;
  box-shadow:
    inset 2px 2px 0 #c7904e,
    inset -2px -2px 0 #74471e;
  flex-shrink: 0;
}

.px-icon-theme {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 3px solid #3d200e;
  box-shadow:
    inset 1px 1px 0 #fff6df,
    inset -1px -1px 0 #9a6a2b;
}

.px-icon-theme svg {
  width: 24px;
  height: 24px;
}

.px-icon-theme--sun {
  background: #ffd24a;
  color: #5f3a00;
}

.px-icon-theme--moon {
  background: #cfe0ff;
  color: #1c3472;
}

.theme-toggle {
  position: relative;
  width: 90px;
  height: 38px;
  display: inline-block;
  cursor: pointer;
  user-select: none;
}

.theme-toggle-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.theme-toggle-track {
  position: absolute;
  inset: 0;
  border: 4px solid #3d200e;
  background: #f7d51d;
  box-shadow:
    inset 2px 2px 0 #ffe977,
    inset -2px -2px 0 #b4820b;
  transition: background 0.12s;
}

.theme-toggle-thumb {
  position: absolute;
  top: 7px;
  left: 7px;
  width: 24px;
  height: 24px;
  border: 3px solid #3d200e;
  background: #fff4d5;
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #cba869;
  transition:
    transform 0.12s steps(2, end),
    background 0.12s;
}

.theme-toggle-input:checked + .theme-toggle-track {
  background: #2f79ff;
  box-shadow:
    inset 2px 2px 0 #7cabff,
    inset -2px -2px 0 #1d4ca3;
}

.theme-toggle-input:checked ~ .theme-toggle-thumb {
  transform: translateX(50px);
  background: #dce8ff;
}

.theme-toggle-input:focus-visible + .theme-toggle-track {
  outline: 3px solid #60c8ff;
  outline-offset: 2px;
}

@media (max-width: 860px) {
  .setting-header {
    align-items: flex-start;
  }

  .theme-switch-wrap {
    margin-left: auto;
  }

  .px-icon-theme {
    width: 20px;
    height: 20px;
  }

  .px-icon-theme svg {
    width: 12px;
    height: 12px;
  }

  .theme-toggle {
    width: 82px;
    height: 34px;
  }

  .theme-toggle-thumb {
    width: 20px;
    height: 18px;
    top: 6px;
    left: 6px;
  }

  .theme-toggle-input:checked ~ .theme-toggle-thumb {
    transform: translateX(38px);
  }
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
