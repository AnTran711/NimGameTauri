<script setup>
import PixelButton from './pixel/PixelButton.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  winner: String
});

const emit = defineEmits(['close', 'replay']);

function onClose() {
  emit('close');
}

function onReplay() {
  emit('replay');
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="win-overlay">
      <div class="win-box">
        <h2 class="win-title">CHÚC MỪNG</h2>
        <p class="win-text">
          Người chiến thắng: <strong>{{ winner }}</strong>
        </p>

        <div class="win-actions">
          <PixelButton color="yellow" class="px-btn" @click="onClose"
            >Về trang chủ</PixelButton
          >
          <PixelButton color="blue" class="px-btn" @click="onReplay"
            >Chơi lại</PixelButton
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.win-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.6);
}
.win-box {
  width: min(92vw, 520px);
  background: #9b6b2a;
  border: 6px solid #3d200e;
  padding: 16px;
  text-align: center;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    6px 6px 0 rgba(0, 0, 0, 0.45);

  user-select: none;
  -webkit-user-select: none;
}
.win-title {
  margin: 0;
  font-size: 48px;
  line-height: 1;
  color: #fff;
  text-shadow: 2px 2px 0 #5c3716;
}
.win-text {
  margin: 10px 0 14px;
  color: #fff;
  font-size: 24px;
}
.win-actions {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}
.px-btn {
  font-size: 24px;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -4px;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
