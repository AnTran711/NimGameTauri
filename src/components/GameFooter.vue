<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

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
  <footer
    class="h-20 bg-white border-t flex items-center justify-between px-64"
  >
    <button
      @click="goHome"
      class="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
    >
      ⬅️ Về trang chủ
    </button>

    <div class="flex gap-4">
      <button
        @click="emit('cancel')"
        class="px-6 py-3 rounded-xl border font-medium transition"
        :class="
          disableButtonOnAITurn
            ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
        "
        :disabled="disableButtonOnAITurn"
      >
        <span v-if="disableButtonOnAITurn" class="flex items-center gap-2">
          <span class="animate-spin">⏳</span> AI đang nghĩ
        </span>
        <span v-else>✖ Hủy chọn</span>
      </button>
      <button
        @click="emit('confirm')"
        class="px-6 py-3 rounded-xl font-semibold transition shadow-sm"
        :class="
          disableButtonOnAITurn
            ? 'bg-blue-300 text-blue-100 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        "
        :disabled="disableButtonOnAITurn"
      >
        <span v-if="disableButtonOnAITurn" class="flex items-center gap-2">
          <span class="animate-spin">⏳</span> AI đang nghĩ
        </span>
        <span v-else>✔ Xác nhận bốc</span>
      </button>
    </div>
  </footer>
</template>
