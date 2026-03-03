<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const gameStore = useGameStore();

const historyMoves = computed(() => gameStore.historyMoves);

const close = () => emit('close');
</script>

<template>
  <!-- Overlay -->
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="close"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
    ></div>
  </transition>

  <!-- Drawer -->
  <transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 class="text-xl font-bold text-gray-800">Lịch sử nước đi</h2>

        <button
          @click="close"
          class="text-gray-500 hover:text-black transition"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          v-if="historyMoves.length === 0"
          class="text-gray-400 text-center mt-10"
        >
          Chưa có nước đi nào
        </div>

        <div
          v-for="move in historyMoves"
          :key="move.moveNumber"
          class="p-3 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
        >
          <div class="text-xs text-gray-400 mb-1">
            Lượt {{ move.moveNumber }}
          </div>

          <div class="text-sm text-gray-800">
            <span class="font-semibold text-blue">
              {{ move.player }}
            </span>
            lấy
            <span class="font-bold text-red-500">
              {{ move.stonesRemoved }}
            </span>
            viên ở đống
            <span class="font-semibold">
              {{ move.heapId }}
            </span>
          </div>

          <div class="text-xs text-gray-500 mt-1">
            {{ move.stonesBefore }} → {{ move.stonesAfter }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
