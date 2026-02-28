<script setup>
import { computed } from 'vue';
import Stone from './Stone.vue';

const emit = defineEmits(['toggleStone', 'toggleSelectAll']);

const props = defineProps({
  heap: Object,
  activeHeapId: Number,
  selectedStones: Array
});

const isActive = computed(() => props.activeHeapId === props.heap.id);

const isDisabled = computed(
  () =>
    (props.activeHeapId !== null && props.activeHeapId !== props.heap.id) ||
    props.heap.stones === 0
);

function onStoneClick(index) {
  if (isDisabled.value) return;
  emit('toggleStone', props.heap.id, index);
}

function isStoneSelected(index) {
  return props.selectedStones.includes(index);
}

// Kiểm tra đã chọn tất cả chưa
const isAllSelected = computed(() => {
  return (
    props.selectedStones.length === props.heap.stones && props.heap.stones > 0
  );
});

// Toggle chọn tất cả / bỏ chọn tất cả
function toggleSelectAll() {
  if (isDisabled.value) return;
  emit('toggleSelectAll', props.heap.id, !isAllSelected.value);
}
</script>

<template>
  <div
    class="relative bg-white rounded-2xl border p-4 transition"
    :class="{
      'opacity-40': isDisabled,
      'border-blue-500 ring-2 ring-blue-300': isActive,
      'cursor-pointer hover:border-slate-300': !isDisabled
    }"
  >
    <!-- badge SELECTED -->
    <div
      v-if="isActive && selectedStones.length > 0"
      class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium"
    >
      {{ selectedStones.length }} đá đã chọn
    </div>

    <div class="flex justify-between items-center text-sm text-slate-500">
      <span class="font-medium">Đống {{ heap.id }}</span>
      <span>Còn lại: {{ heap.stones }}</span>
    </div>

    <div class="h-22 mt-2 grid grid-cols-5 gap-2 place-items-center">
      <Stone
        v-for="i in heap.stones"
        :key="i"
        :selected="isStoneSelected(i)"
        :disabled="isDisabled"
        @click.stop="onStoneClick(i)"
      />
    </div>

    <!-- Checkbox chọn tất cả -->
    <div class="mt-2 flex items-center justify-center gap-2">
      <input
        type="checkbox"
        :id="'selectAll-' + heap.id"
        :checked="isAllSelected"
        :disabled="isDisabled"
        @change="toggleSelectAll"
        class="w-4 h-4 text-blue-500 rounded cursor-pointer disabled:cursor-not-allowed"
      />
      <label
        :for="'selectAll-' + heap.id"
        class="text-sm text-slate-600 cursor-pointer select-none"
        :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
      >
        Chọn tất cả
      </label>
    </div>
  </div>
</template>
