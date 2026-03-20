<script setup>
import PixelButton from './pixel/PixelButton.vue';

defineProps({
  currentPlayer: Number,
  gameMode: String,
  variant: String,
  aiLevel: String
});

const emit = defineEmits(['openMoveDrawer', 'saveGame']);

const openMoveDrawer = () => emit('openMoveDrawer');
const saveGame = () => emit('saveGame');
</script>

<template>
  <header class="px-header">
    <div class="left">
      <div>
        <p class="title">NIM GAME</p>
        <p class="sub">
          {{
            gameMode === 'PVP'
              ? 'Người vs Người'
              : `Người vs Máy (${aiLevel === 'easy' ? 'Dễ' : 'Khó'})`
          }}
        </p>
      </div>
    </div>

    <div class="right">
      <div class="chip chip-blue">
        Lượt:
        {{
          gameMode === 'PVP'
            ? `Người chơi ${currentPlayer}`
            : currentPlayer === 1
              ? 'Người'
              : 'Máy'
        }}
      </div>
      <div class="chip chip-brown">
        Thể loại: {{ variant === 'normal' ? 'Nim chuẩn' : 'Misère' }}
      </div>
      <PixelButton color="green" class="px-btn" @click="saveGame"
        >Lưu game</PixelButton
      >
      <PixelButton color="blue" class="px-btn" @click="openMoveDrawer"
        >Lịch sử</PixelButton
      >
    </div>
  </header>
</template>

<style scoped>
.px-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-bottom: 4px solid #3d200e;
  background: #b87e35;
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.title {
  margin: 0;
  font-size: 32px;
  line-height: 1;
  color: #fff;
}
.sub {
  margin: 4px 0 0;
  font-size: 24px;
  color: #fff;
  line-height: 1.1;
}
.right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.chip {
  border: 3px solid #3d200e;
  padding: 6px 8px;
  line-height: 1;
  font-size: 24px;
  color: #fff;
}
.chip-blue {
  background: #2f79ff;
}
.chip-brown {
  background: #8a5820;
}
.px-btn {
  font-size: 24px;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -4px;
}
</style>
