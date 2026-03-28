<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import AppDialog from '@/components/AppDialog.vue';
import { useMusicStore } from '@/stores/musicStore';

const musicStore = useMusicStore();

function unlockOnFirstInteraction() {
  musicStore.unlockAudio();
}

onMounted(() => {
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
  <router-view />
  <app-dialog />
</template>
