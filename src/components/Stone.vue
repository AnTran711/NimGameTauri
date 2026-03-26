<script setup>
defineProps({
  selected: Boolean,
  disabled: Boolean,
  picked: Boolean
});
</script>

<template>
  <img
    v-if="selected"
    class="stone"
    :class="{ 'stone--disabled': disabled, 'stone--picked': picked }"
    src="/stone-active.png"
    alt=""
  />
  <img
    v-else
    class="stone"
    :class="{ 'stone--disabled': disabled, 'stone--picked': picked }"
    src="/stone.png"
    alt=""
  />
</template>

<style scoped>
.stone {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  cursor: pointer;
  transition:
    transform 120ms ease,
    filter 120ms ease;
}

.stone:not(.stone--disabled):hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.stone:not(.stone--disabled):active {
  transform: translateY(1px) scale(0.95);
}

.stone--disabled {
  cursor: default;
  pointer-events: none;
}

.stone--picked {
  animation: stone-pick 240ms ease forwards;
  pointer-events: none;
  will-change: transform, opacity, filter;
}

@keyframes stone-pick {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-14px) scale(0.68) rotate(-8deg);
    filter: brightness(1.25);
  }
}
</style>
