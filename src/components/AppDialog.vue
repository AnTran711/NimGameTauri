<script setup>
import PixelButton from '@/components/pixel/PixelButton.vue';
import { useDialog } from '@/composables/useDialog';

const { dialogState, onConfirm, onCancel } = useDialog();
</script>

<template>
  <transition name="dlg">
    <div v-if="dialogState.open" class="dlg-overlay">
      <div class="dlg-box">
        <h2 class="dlg-title">{{ dialogState.title }}</h2>
        <p class="dlg-message">{{ dialogState.message }}</p>

        <div class="dlg-actions">
          <PixelButton
            v-if="dialogState.type === 'confirm'"
            color="gray"
            class="dlg-btn"
            @click="onCancel"
          >
            {{ dialogState.cancelText }}
          </PixelButton>

          <PixelButton color="blue" class="dlg-btn" @click="onConfirm">
            {{ dialogState.confirmText }}
          </PixelButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.dlg-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  padding: 12px;
}

.dlg-box {
  width: min(92vw, 540px);
  background: #9b6b2a;
  border: 6px solid #3d200e;
  padding: 16px;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    8px 8px 0 rgba(0, 0, 0, 0.45);
  image-rendering: pixelated;

  user-select: none;
  -webkit-user-select: none;
}

.dlg-title {
  margin: 0;
  color: #fff;
  text-shadow: 2px 2px 0 #5c3716;
  font-size: 34px;
  line-height: 1;
}

.dlg-message {
  margin: 12px 0 16px;
  color: #fff;
  font-size: 24px;
  line-height: 1.2;
  white-space: pre-wrap;
}

.dlg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dlg-btn {
  min-width: 120px;
  font-size: 24px;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -4px;
}

.dlg-enter-active,
.dlg-leave-active {
  transition: 0.18s ease;
}

.dlg-enter-from,
.dlg-leave-to {
  opacity: 0;
}
</style>
