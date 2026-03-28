import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'nim_game_settings_v1';
const MIN_LIMIT = 3;
const MAX_LIMIT = 10;

function clampLimit(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return MIN_LIMIT;
  const intValue = Math.trunc(n);
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, intValue));
}

export const useGameSettingsStore = defineStore('gameSettings', () => {
  // states
  const minHeaps = ref(3);
  const maxHeaps = ref(10);
  const minStones = ref(3);
  const maxStones = ref(10);

  // actions
  function persistSettings() {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        minHeaps: minHeaps.value,
        maxHeaps: maxHeaps.value,
        minStones: minStones.value,
        maxStones: maxStones.value
      })
    );
  }

  function setMinHeaps(value) {
    minHeaps.value = clampLimit(value);
    // Đảm bảo minHeaps không lớn hơn maxHeaps
    if (minHeaps.value > maxHeaps.value) maxHeaps.value = minHeaps.value;
    persistSettings();
  }

  function setMaxHeaps(value) {
    maxHeaps.value = clampLimit(value);
    // Đảm bảo maxHeaps không nhỏ hơn minHeaps
    if (maxHeaps.value < minHeaps.value) minHeaps.value = maxHeaps.value;
    persistSettings();
  }

  function setMinStones(value) {
    minStones.value = clampLimit(value);
    // Đảm bảo minStones không lớn hơn maxStones
    if (minStones.value > maxStones.value) maxStones.value = minStones.value;
    persistSettings();
  }

  function setMaxStones(value) {
    maxStones.value = clampLimit(value);
    // Đảm bảo maxStones không nhỏ hơn minStones
    if (maxStones.value < minStones.value) minStones.value = maxStones.value;
    persistSettings();
  }

  function loadSettings() {
    if (typeof localStorage === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      minHeaps.value = clampLimit(parsed.minHeaps ?? 3);
      maxHeaps.value = clampLimit(parsed.maxHeaps ?? 10);
      minStones.value = clampLimit(parsed.minStones ?? 3);
      maxStones.value = clampLimit(parsed.maxStones ?? 10);

      if (minHeaps.value > maxHeaps.value) {
        maxHeaps.value = minHeaps.value;
      }
      if (minStones.value > maxStones.value) {
        maxStones.value = minStones.value;
      }
    } catch {
      minHeaps.value = 3;
      maxHeaps.value = 10;
      minStones.value = 3;
      maxStones.value = 10;
    }
  }

  loadSettings();

  return {
    minHeaps,
    maxHeaps,
    minStones,
    maxStones,
    setMinHeaps,
    setMaxHeaps,
    setMinStones,
    setMaxStones,
    loadSettings,
    persistSettings
  };
});
