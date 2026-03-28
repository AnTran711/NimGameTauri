import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'nim_audio_settings_v1';

function clamp01(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function canUseAudio() {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

function createAudioPool(src, size) {
  if (!canUseAudio()) return [];
  const pool = [];

  for (let i = 0; i < size; i += 1) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    pool.push(audio);
  }

  return pool;
}

export const useMusicStore = defineStore('music', () => {
  // states
  const sfxEnabled = ref(true);
  const bgmEnabled = ref(true);
  const sfxVolume = ref(0.5);
  const bgmVolume = ref(0.5);

  // internal
  function isTauriDesktop() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);
  }

  const audioUnlocked = ref(isTauriDesktop()); // Tauri desktop builds có thể tự động phát âm thanh mà không cần unlock

  const buttonPool = createAudioPool('/button-click.mp3', 5);
  const stonePool = createAudioPool('/pick-stone.mp3', 6);

  const bgmAudio = canUseAudio() ? new Audio('/background-music.mp3') : null;
  if (bgmAudio) {
    bgmAudio.preload = 'auto';
    bgmAudio.loop = true;
  }

  let buttonCursor = 0;
  let stoneCursor = 0;

  function applyVolumes() {
    const safeSfx = clamp01(sfxVolume.value);
    const safeBgm = clamp01(bgmVolume.value);

    for (const audio of buttonPool) audio.volume = safeSfx;
    for (const audio of stonePool) audio.volume = safeSfx;
    if (bgmAudio) bgmAudio.volume = safeBgm;
  }

  function playFromPool(pool, type) {
    if (!pool.length) return;

    let index = 0;
    if (type === 'button') {
      index = buttonCursor;
      buttonCursor = (buttonCursor + 1) % pool.length;
    } else {
      index = stoneCursor;
      stoneCursor = (stoneCursor + 1) % pool.length;
    }

    const audio = pool[index];
    audio.currentTime = 0;
    audio.volume = clamp01(sfxVolume.value);
    audio.play().catch(() => {});
  }

  // actions
  function playButtonClick() {
    if (!sfxEnabled.value) return;
    playFromPool(buttonPool, 'button');
  }

  function playStoneClick() {
    if (!sfxEnabled.value) return;
    playFromPool(stonePool, 'stone');
  }

  function startBgm() {
    if (!bgmEnabled.value) return;
    if (!bgmAudio) return;
    if (!audioUnlocked.value) return;

    bgmAudio.volume = clamp01(bgmVolume.value);
    bgmAudio.play().catch(() => {});
  }

  function stopBgm() {
    if (!bgmAudio) return;
    bgmAudio.pause();
  }

  function unlockAudio() {
    audioUnlocked.value = true;
    startBgm();
  }

  function setSfxEnabled(enabled) {
    sfxEnabled.value = !!enabled;
    persistSettings();
  }

  function setBgmEnabled(enabled) {
    bgmEnabled.value = !!enabled;
    persistSettings();

    if (bgmEnabled.value) {
      startBgm();
    } else {
      stopBgm();
    }
  }

  function setSfxVolume(volume) {
    sfxVolume.value = clamp01(volume);
    applyVolumes();
    persistSettings();
  }

  function setBgmVolume(volume) {
    bgmVolume.value = clamp01(volume);
    applyVolumes();
    persistSettings();
  }

  function persistSettings() {
    if (typeof localStorage === 'undefined') return;

    const payload = {
      sfxEnabled: sfxEnabled.value,
      bgmEnabled: bgmEnabled.value,
      sfxVolume: sfxVolume.value,
      bgmVolume: bgmVolume.value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadSettings() {
    if (typeof localStorage === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        applyVolumes();
        return;
      }

      const parsed = JSON.parse(raw);

      sfxEnabled.value = parsed.sfxEnabled ?? true;
      bgmEnabled.value = parsed.bgmEnabled ?? true;
      sfxVolume.value = clamp01(parsed.sfxVolume ?? 0.5);
      bgmVolume.value = clamp01(parsed.bgmVolume ?? 0.5);
    } catch {
      sfxEnabled.value = true;
      bgmEnabled.value = true;
      sfxVolume.value = 0.5;
      bgmVolume.value = 0.5;
    }

    applyVolumes();

    if (bgmEnabled.value && audioUnlocked.value) {
      startBgm();
    } else {
      stopBgm();
    }
  }

  // init
  applyVolumes();

  return {
    sfxEnabled,
    bgmEnabled,
    sfxVolume,
    bgmVolume,
    audioUnlocked,

    playButtonClick,
    playStoneClick,
    startBgm,
    stopBgm,
    unlockAudio,

    setSfxEnabled,
    setBgmEnabled,
    setSfxVolume,
    setBgmVolume,

    persistSettings,
    loadSettings
  };
});
