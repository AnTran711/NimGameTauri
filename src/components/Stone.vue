<script setup>
defineProps({
  selected: Boolean,
  disabled: Boolean
});
</script>

<template>
  <img v-if="selected" class="stone" src="/stone-active.png" alt="" />
  <img v-else class="stone" src="/stone.png" alt="" />
</template>

<style scoped>
.stone {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  cursor: pointer;
}
</style>
