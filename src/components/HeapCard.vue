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

const stoneList = computed(() =>
  Array.from({ length: props.heap.stones }, (_, i) => i + 1)
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
    class="heap-card"
    :class="{ disabled: isDisabled, active: isActive && !isDisabled }"
  >
    <div v-if="isActive && selectedStones.length > 0" class="selected-badge">
      {{ selectedStones.length }} đá đã chọn
    </div>

    <div class="heap-top">
      <span>Đống {{ heap.id }}</span>
      <span>Còn lại: {{ heap.stones }}</span>
    </div>

    <TransitionGroup name="stone-pop" tag="div" class="stone-grid">
      <Stone
        v-for="i in stoneList"
        :key="i"
        :selected="isStoneSelected(i)"
        :disabled="isDisabled"
        @click.stop="onStoneClick(i)"
      />
    </TransitionGroup>

    <label class="select-all" :class="{ off: isDisabled }">
      <input
        class="select-all__native"
        type="checkbox"
        :checked="isAllSelected"
        :disabled="isDisabled"
        @change="toggleSelectAll"
      />
      <span class="select-all__box" aria-hidden="true"></span>
      <span class="select-all__text">Chọn tất cả</span>
    </label>
  </div>
</template>

<style scoped>
.heap-card {
  position: relative;
  border: 4px solid #3d200e;
  padding: 10px;
  background-color: #ef9a32;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
}
.heap-card,
.heap-card * {
  user-select: none;
  -webkit-user-select: none;
}

.heap-card.active {
  border-color: #f7d51d;
}
.heap-card.disabled {
  opacity: 0.45;
  pointer-events: none;
}
.selected-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: #2f79ff;
  color: #fff;
  border: 3px solid #3d200e;
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
}
.heap-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  margin-bottom: 8px;
  gap: 8px;
}
.stone-grid {
  min-height: 70px;
  display: grid;
  grid-template-columns: repeat(5, 32px);
  grid-auto-rows: 32px;
  gap: 6px;
  justify-content: center;
  align-content: center;
  place-items: center;
  margin: 2px 0 4px;
}

.stone-pop-enter-active,
.stone-pop-leave-active {
  transition:
    transform 240ms ease,
    opacity 240ms ease;
  will-change: transform, opacity;
}

.stone-pop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.75);
  filter: brightness(1.25);
}

.stone-pop-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.65) rotate(-8deg);
  filter: brightness(1.4);
}

.stone-pop-move {
  transition: transform 180ms ease;
}
.select-all {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.select-all__native {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.select-all__box {
  width: 18px;
  height: 18px;
  border: 2px solid #3d200e;
  background: #eecb92;
  box-shadow:
    inset 1px 1px 0 #f3d2a8,
    inset -1px -1px 0 #8a5820;
  flex: 0 0 18px; /* khóa kích thước, không bị co kéo */
}

.select-all__text {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  transform: translateY(-4px); /* chỉnh thị giác do baseline pixel font */
}

.select-all__native:checked + .select-all__box {
  background: #f7d51d;
  box-shadow:
    inset 0 0 0 3px #3d200e,
    inset 1px 1px 0 #ffe977,
    inset -1px -1px 0 #b4820b;
}

.select-all__native:focus-visible + .select-all__box {
  outline: 2px solid #60c8ff;
  outline-offset: 2px;
}

.select-all.off {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
