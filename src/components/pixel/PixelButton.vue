<script setup>
import { computed, useAttrs } from 'vue';
import { useMusicStore } from '@/stores/musicStore';

const props = defineProps({
  color: {
    type: String,
    default: 'gray'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const attrs = useAttrs();
const musicStore = useMusicStore();

const colorClass = computed(() => {
  const map = {
    yellow: 'bg-yellow-400 hover:bg-yellow-300',
    red: 'bg-red-500 hover:bg-red-400 text-white',
    blue: 'bg-blue-500 hover:bg-blue-400 text-white',
    green: 'bg-green-500 hover:bg-green-400 text-white',
    gray: 'bg-gray-400 hover:bg-gray-300',
    brown: 'bg-[#8B4513] hover:bg-[#A0522D] text-white'
  };

  return map[props.color] || map.gray;
});

function onClickWithSound() {
  if (props.disabled) return;
  musicStore.playButtonClick();
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="pixel-btn px-2 py-1 border-4 border-black font-bold flex items-center justify-center leading-none select-none transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    v-bind="attrs"
    :class="colorClass"
    @click="onClickWithSound"
  >
    <span class="pixel-btn__label"><slot></slot></span>
  </button>
</template>

<style scoped>
.pixel-btn {
  box-shadow: 4px 4px 0px black;
  appearance: none;
  -webkit-appearance: none;
  line-height: 1;
}

.pixel-btn__label {
  font-size: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  line-height: 1;
  transform: translateY(var(--pixel-text-nudge, -1px));
}

.pixel-btn:hover {
  transform: translateY(-1px);
}

.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px black;
}
</style>
