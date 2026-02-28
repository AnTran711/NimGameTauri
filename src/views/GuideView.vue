<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v2m0 14v2m9-9h-2M5 12H3"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Hướng dẫn chơi Nim
        </h1>

        <p class="text-gray-500 max-w-xl mx-auto">
          Trò chơi chiến thuật toán học đơn giản nhưng đầy thử thách. Hãy nắm
          vững luật chơi để trở thành người chiến thắng.
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-8">
        <!-- Intro -->
        <section class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-xl font-semibold mb-3">🌟 Giới thiệu</h2>
          <p class="text-gray-600 leading-relaxed">
            Nim là một trò chơi chiến thuật nổi tiếng, yêu cầu người chơi phải
            suy nghĩ logic và tính toán cẩn thận. Mỗi nước đi đều ảnh hưởng trực
            tiếp đến kết quả trận đấu.
          </p>
        </section>

        <!-- Rules -->
        <section class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-xl font-semibold mb-3">📌 Luật chơi cơ bản</h2>

          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li>Trò chơi gồm nhiều đống đá.</li>
            <li>Hai người chơi lần lượt thực hiện lượt đi.</li>
            <li>Mỗi lượt chỉ được chọn một đống đá để bốc.</li>
            <li>Lấy ít nhất một viên đá từ đống đã chọn.</li>
            <li>Khi không còn viên đá nào, trò chơi kết thúc.</li>
          </ul>
        </section>

        <!-- Modes -->
        <section class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-xl font-semibold mb-4">⚖️ Chế độ chơi</h2>

          <div class="space-y-3">
            <p class="text-gray-600">
              <span class="font-semibold text-blue-600">Normal:</span>
              Người lấy viên đá cuối cùng sẽ thắng.
            </p>

            <p class="text-gray-600">
              <span class="font-semibold text-red-500">Misère:</span>
              Người lấy viên đá cuối cùng sẽ thua.
            </p>

            <p class="text-gray-500 text-sm">
              Hãy luôn chú ý chế độ trước khi bắt đầu trận đấu.
            </p>
          </div>
        </section>
      </div>

      <!-- Back Button -->
      <div class="flex justify-center mt-12">
        <button
          @click="goHome"
          class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg shadow transition"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay về trang chủ
        </button>
      </div>
    </div>
  </div>
</template>
