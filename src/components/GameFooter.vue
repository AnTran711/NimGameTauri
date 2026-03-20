<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PixelButton from './pixel/PixelButton.vue';

const router = useRouter();

function goHome() {
  router.push('/');
}

const emit = defineEmits(['cancel', 'confirm']);

const props = defineProps({
  gameMode: String,
  currentPlayer: Number
});

const disableButtonOnAITurn = computed(
  () => props.gameMode === 'PVE' && props.currentPlayer === 2
);
</script>

<template>
  <footer class="px-footer">
    <PixelButton color="yellow" class="px-btn" @click="goHome">
      Về trang chủ
    </PixelButton>

    <div class="actions">
      <PixelButton
        color="red"
        @click="emit('cancel')"
        class="px-btn"
        :disabled="disableButtonOnAITurn"
      >
        <span v-if="disableButtonOnAITurn">AI đang nghĩ...</span>
        <span v-else>Hủy chọn</span>
      </PixelButton>

      <PixelButton
        color="blue"
        @click="emit('confirm')"
        class="px-btn"
        :disabled="disableButtonOnAITurn"
      >
        <span v-if="disableButtonOnAITurn">AI đang nghĩ...</span>
        <span v-else>Xác nhận bốc</span>
      </PixelButton>
    </div>
  </footer>
</template>

<style scoped>
.px-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-top: 4px solid #3d200e;
  background: #b87e35;
}
.px-btn {
  font-size: 24px;
  text-align: center;
  line-height: 1;
  --pixel-text-nudge: -4px;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
