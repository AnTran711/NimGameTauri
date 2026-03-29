<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import AppDialog from '@/components/AppDialog.vue';
import { useMusicStore } from '@/stores/musicStore';
import { useGameSettingsStore } from '@/stores/gameSettingsStore';

const musicStore = useMusicStore();
const gameSettingsStore = useGameSettingsStore();

const themeClass = computed(() =>
  gameSettingsStore.isDarkTheme ? 'bg-dark' : 'bg-light'
);

function unlockOnFirstInteraction() {
  musicStore.unlockAudio();
}

onMounted(() => {
  gameSettingsStore.loadSettings();
  musicStore.loadSettings();
  musicStore.startBgm();

  window.addEventListener('pointerdown', unlockOnFirstInteraction, {
    once: true
  });
  window.addEventListener('keydown', unlockOnFirstInteraction, { once: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', unlockOnFirstInteraction);
  window.removeEventListener('keydown', unlockOnFirstInteraction);
});
</script>

<template>
  <div class="screen" :class="themeClass">
    <router-view />
  </div>
  <app-dialog />
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.bg-light {
  background-image: url('/background-forest.jpg');
}

.bg-dark {
  background-image: url('/background-forest-dark.jpg');
}
</style>
