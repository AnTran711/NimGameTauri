<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  winner: String
});

const emit = defineEmits(['close', 'replay']);

function onClose() {
  emit('close');
}

function onReplay() {
  emit('replay');
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <!-- Modal Box -->
      <div
        class="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 text-center"
      >
        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🎉 Chúc mừng!</h2>

        <!-- Winner -->
        <p class="text-lg text-gray-600 mb-6">
          Người chiến thắng là:
          <span class="font-semibold text-indigo-600">
            {{ winner }}
          </span>
        </p>

        <!-- Buttons -->
        <div class="flex justify-center gap-4">
          <!-- Exit -->
          <button
            @click="onClose"
            class="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            ⬅️ Về trang chủ
          </button>

          <!-- Play Again -->
          <button
            @click="onReplay"
            class="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            🔄 Chơi lại
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
