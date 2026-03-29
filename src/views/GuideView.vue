<script setup>
import { useRouter } from 'vue-router';
import PixelButton from '@/components/pixel/PixelButton.vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="guide-wrap">
    <header class="guide-hero">
      <div class="hero-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="9" y="4" width="6" height="2" />
          <rect x="7" y="6" width="2" height="2" />
          <rect x="15" y="6" width="2" height="2" />
          <rect x="19" y="4" width="2" height="2" />
          <rect x="21" y="2" width="2" height="2" />
          <rect y="10" width="3" height="2" />
          <rect x="21" y="10" width="3" height="2" />
          <rect x="3" y="4" width="2" height="2" />
          <rect x="1" y="2" width="2" height="2" />
          <rect x="7" y="14" width="2" height="2" />
          <rect x="15" y="14" width="2" height="2" />
          <rect x="5" y="8" width="2" height="6" />
          <rect x="17" y="8" width="2" height="6" />
          <rect x="9" y="16" width="6" height="2" />
          <rect x="9" y="20" width="6" height="2" />
          <rect x="9" y="18" width="2" height="2" />
          <rect x="13" y="18" width="2" height="2" />
          <rect x="11" width="2" height="3" />
        </svg>
      </div>

      <h1 class="guide-title">HƯỚNG DẪN CHƠI NIM</h1>
      <p class="guide-subtitle">
        Trò chơi chiến thuật toán học đơn giản nhưng đầy thử thách.
      </p>
    </header>

    <main class="guide-grid">
      <section class="guide-card">
        <h2 class="card-title">GIỚI THIỆU</h2>
        <p class="card-text">
          Nim là trò chơi chiến thuật nổi tiếng, yêu cầu người chơi suy nghĩ
          logic và tính toán cẩn thận. Mỗi nước đi đều ảnh hưởng trực tiếp đến
          kết quả trận đấu.
        </p>
      </section>

      <section class="guide-card">
        <h2 class="card-title">LUẬT CHƠI CƠ BẢN</h2>
        <ul class="rule-list">
          <li>Trò chơi gồm nhiều đống đá.</li>
          <li>Hai người chơi lần lượt thực hiện lượt đi.</li>
          <li>Mỗi lượt chỉ được chọn một đống đá để bốc.</li>
          <li>Lấy ít nhất một viên đá từ đống đã chọn.</li>
          <li>Khi không còn viên đá nào, trò chơi kết thúc.</li>
        </ul>
      </section>

      <section class="guide-card guide-card--full">
        <h2 class="card-title">CHẾ ĐỘ CHƠI</h2>
        <div class="mode-row">
          <span class="mode-chip mode-chip--blue">NORMAL</span>
          <p class="card-text">Người lấy viên đá cuối cùng sẽ thắng.</p>
        </div>
        <div class="mode-row">
          <span class="mode-chip mode-chip--red">MISERE</span>
          <p class="card-text">Người lấy viên đá cuối cùng sẽ thua.</p>
        </div>
        <p class="card-note">
          * Luôn kiểm tra chế độ trước khi bắt đầu trận đấu.
        </p>
      </section>
    </main>

    <div class="guide-actions">
      <PixelButton color="yellow" class="home-btn" @click="goHome">
        Quay về trang chủ
      </PixelButton>
    </div>
  </div>
</template>

<style scoped>
.guide-wrap {
  width: min(980px, 100%);
  background: #9b6b2a;
  border: 6px solid #3d200e;
  padding: 18px;
  box-shadow:
    inset 3px 3px 0 #c8924a,
    inset -3px -3px 0 #6b3d18,
    8px 8px 0 rgba(0, 0, 0, 0.45);
  image-rendering: pixelated;

  user-select: none;
  -webkit-user-select: none;
}

.guide-hero {
  text-align: center;
  margin-bottom: 14px;
}

.hero-icon {
  width: 74px;
  height: 74px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  color: #3d200e;
  background: #f7d51d;
  border: 4px solid #3d200e;
  box-shadow:
    inset 2px 2px 0 #ffe977,
    inset -2px -2px 0 #b4820b;
}

.guide-title {
  margin: 0;
  font-size: 40px;
  line-height: 1;
  letter-spacing: 2px;
  color: #fff8d5;
  text-shadow: 2px 2px 0 #6a3d11;
}

.guide-subtitle {
  margin: 10px auto 0;
  max-width: 720px;
  font-size: 24px;
  line-height: 1.25;
  color: #ffe2bf;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.guide-card {
  background: #b87e35;
  border: 4px solid #3d200e;
  padding: 12px;
  box-shadow:
    inset 2px 2px 0 #d4a060,
    inset -2px -2px 0 #8a5820;
}

.guide-card--full {
  grid-column: 1 / -1;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  line-height: 1;
  color: #fff4d7;
  text-shadow: 2px 2px 0 #6a3d11;
}

.card-text {
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
  color: #fff0d8;
}

.rule-list {
  list-style: none;
  margin: 0;
  padding-left: 0;
  color: #fff0d8;
  font-size: 24px;
  line-height: 1.25;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.mode-chip {
  flex: 0 0 auto;
  min-width: 108px;
  text-align: center;
  padding: 4px 8px;
  border: 3px solid #3d200e;
  color: #fff;
  font-size: 24px;
  line-height: 1;
}

.mode-chip--blue {
  background: #2f79ff;
}

.mode-chip--red {
  background: #d94848;
}

.card-note {
  margin: 4px 0 0;
  font-size: 20px;
  color: #ffe2bf;
}

.guide-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.home-btn {
  font-size: 24px;
  line-height: 1;
  --pixel-text-nudge: -4px;
  min-width: 260px;
  justify-content: center;
}

@media (max-width: 760px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }

  .guide-card--full {
    grid-column: auto;
  }

  .mode-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
