<script setup>
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
  <header class="h-16 bg-white border-b flex items-center justify-between px-6">
    <div class="flex items-center gap-3">
      <div
        class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center"
      >
        ⬛
      </div>
      <span class="text-lg font-semibold">Nim Game</span>
      <span class="text-lg font-semibold">{{
        gameMode === 'PVP'
          ? 'Người vs Người'
          : `Người vs Máy (${aiLevel === 'easy' ? 'Dễ' : 'Khó'})`
      }}</span>
    </div>

    <div class="flex items-center gap-3">
      <div
        class="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
      >
        🟢 Lượt hiện tại:
        {{
          gameMode === 'PVP'
            ? `Người chơi ${currentPlayer}`
            : currentPlayer === 1
              ? 'Người'
              : 'Máy'
        }}
      </div>
      <div class="px-4 py-2 rounded-lg bg-slate-100 text-sm">
        🎮 Thể loại: {{ variant === 'normal' ? 'Nim chuẩn' : 'Misère' }}
      </div>
      <button
        @click="saveGame"
        class="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
      >
        💾 Lưu game
      </button>
      <button
        @click="openMoveDrawer"
        class="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Xem lịch sử
      </button>
    </div>
  </header>
</template>
