<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import PixelButton from './pixel/PixelButton.vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const gameStore = useGameStore();

const historyMoves = computed(() => gameStore.historyMoves);

const close = () => emit('close');
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" @click="close" class="overlay"></div>
  </transition>

  <transition
    enter-active-class="transform transition duration-200"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition duration-150"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside v-if="isOpen" class="drawer">
      <div class="drawer-head">
        <h2>Lịch sử nước đi</h2>
        <PixelButton color="red" class="px-btn" @click="close">
          Đóng
        </PixelButton>
      </div>

      <div class="drawer-body">
        <p v-if="historyMoves.length === 0" class="empty">
          Chưa có nước đi nào
        </p>

        <div
          v-for="move in historyMoves"
          :key="move.moveNumber"
          class="move-card"
        >
          <p class="mv-top">Lượt {{ move.moveNumber }}</p>
          <p class="mv-main">
            {{ move.player }} lấy {{ move.stonesRemoved }} viên ở đống
            {{ move.heapId }}
          </p>
          <p class="mv-sub">
            {{ move.stonesBefore }} viên -> {{ move.stonesAfter }} viên
          </p>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  width: min(92vw, 420px);
  height: 100%;
  background: #9b6b2a;
  border-left: 6px solid #3d200e;
  color: #fff;

  user-select: none;
  -webkit-user-select: none;
}
.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #3d200e;
  background: #b87e35;
  padding: 10px;
}
.drawer-head h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1;
}
.px-btn {
  font-size: 20px;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -3px;
}
.drawer-body {
  padding: 10px;
  overflow-y: auto;
  height: calc(100% - 56px);
}
.move-card {
  border: 3px solid #3d200e;
  background: #b87e35;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
  padding: 8px;
  margin-bottom: 8px;
}
.mv-top {
  margin: 0 0 4px;
  font-size: 24px;
  color: #fff;
}
.mv-main {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}
.mv-sub {
  margin: 4px 0 0;
  font-size: 24px;
  color: #fff;
}
.empty {
  margin-top: 20px;
  text-align: center;
}
</style>
