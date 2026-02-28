<script setup>
import { computed } from 'vue';

const props = defineProps({
  selected: Boolean,
  disabled: Boolean,
});

const stoneClass = computed(() => {
  if (props.disabled) return 'bg-slate-200 cursor-not-allowed';
  if (props.selected) return 'bg-blue-500 text-white scale-105 shadow-lg';
  return 'bg-slate-300 hover:bg-slate-400 cursor-pointer';
});
</script>

<template>
  <div
    class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
    :class="stoneClass"
  >
    <span v-if="selected" class="text-white font-bold text-lg">✓</span>
  </div>
</template>
