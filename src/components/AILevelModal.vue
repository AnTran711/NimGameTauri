<script setup>
const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'select']);

const select = (level) => {
  emit('select', level);
};

const close = () => {
  emit('close');
};
</script>

<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <!-- Modal -->
      <div class="w-105 bg-white rounded-2xl shadow-2xl p-8 text-center">
        <!-- Icon -->
        <div
          class="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-gray-800 mb-1">Chọn độ khó máy</h2>

        <p class="text-gray-500 mb-8 text-sm">
          Hãy chọn mức độ thử thách phù hợp với bạn.
        </p>

        <!-- Options -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <!-- Easy -->
          <button
            @click="select('easy')"
            class="p-5 rounded-xl border border-gray-200 transition cursor-pointer hover:ring-2 hover:ring-green-400 hover:bg-green-50"
          >
            <div
              class="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-green-100 text-green-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
            </div>

            <p class="font-semibold text-green-600">Dễ</p>
          </button>

          <!-- Hard -->
          <button
            @click="select('hard')"
            class="p-5 rounded-xl border border-gray-200 transition cursor-pointer hover:ring-2 hover:ring-blue-400 hover:bg-blue-50"
          >
            <div
              class="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <p class="font-semibold text-blue-600">Khó</p>
          </button>
        </div>

        <!-- Cancel -->
        <button
          @click="close"
          class="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  </div>
</template>
