<script setup>
import PixelButton from './pixel/PixelButton.vue';

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
  <div v-if="show" class="px-overlay" @click.self="close">
    <div class="px-modal">
      <h2 class="px-title">Chọn độ khó máy</h2>
      <p class="px-subtitle">Hãy chọn mức độ thử thách phù hợp với bạn.</p>

      <div class="px-options">
        <PixelButton
          color="green"
          class="px-option--easy"
          @click="select('easy')"
        >
          <div class="p-4 flex flex-col justify-center items-center">
            <div class="px-option-icon" aria-hidden="true">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="6" y="20" width="12" height="2" />
                <rect x="6" y="2" width="12" height="2" />
                <rect x="18" y="4" width="2" height="2" />
                <rect x="4" y="4" width="2" height="2" />
                <rect x="4" y="18" width="2" height="2" />
                <rect x="18" y="18" width="2" height="2" />
                <rect x="2" y="6" width="2" height="12" />
                <rect x="20" y="6" width="2" height="12" />
                <rect x="7" y="13" width="2" height="2" />
                <rect x="9" y="15" width="6" height="2" />
                <rect x="15" y="13" width="2" height="2" />
                <rect x="8" y="8" width="2" height="2" />
                <rect x="14" y="8" width="2" height="2" />
              </svg>
            </div>
            <p class="px-option-label">Dễ</p>
          </div>
        </PixelButton>

        <PixelButton
          color="blue"
          class="px-option--hard"
          @click="select('hard')"
        >
          <div class="p-4 flex flex-col justify-center items-center">
            <div class="px-option-icon" aria-hidden="true">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="7" y="20" width="2" height="2" />
                <rect x="11" y="20" width="2" height="2" />
                <rect x="15" y="20" width="2" height="2" />
                <rect x="9" y="16" width="2" height="4" />
                <rect x="13" y="16" width="2" height="4" />
                <rect x="5" y="14" width="2" height="6" />
                <rect x="17" y="14" width="2" height="6" />
                <rect x="3" y="14" width="4" height="2" />
                <rect x="1" y="4" width="2" height="10" />
                <rect x="21" y="4" width="2" height="10" />
                <rect x="3" y="2" width="18" height="2" />
                <rect x="17" y="14" width="4" height="2" />
                <rect x="8" y="7" width="2" height="4" />
                <rect x="14" y="7" width="2" height="4" />
              </svg>
            </div>
            <p class="px-option-label">Khó</p>
          </div>
        </PixelButton>
      </div>

      <div class="flex justify-center mt-8">
        <PixelButton
          color="red"
          style="--pixel-text-nudge: -4px"
          @click="close"
        >
          Hủy bỏ
        </PixelButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.62);
  padding: 12px;
}

.px-modal {
  position: relative;
  width: min(92vw, 560px);
  background: #b87e35;
  color: #fff;
  border: 6px solid #3d200e;
  padding: 20px 18px 18px;
  box-shadow:
    inset 3px 3px 0 #d4a060,
    inset -3px -3px 0 #8a5820,
    6px 6px 0 rgba(0, 0, 0, 0.5);
  text-align: center;
  image-rendering: pixelated;

  user-select: none;
  -webkit-user-select: none;
}

.px-title {
  margin: 0;
  font-size: 30px;
  line-height: 1;
  color: #fff7cf;
  text-shadow: 2px 2px 0 #5c3716;
}

.px-subtitle {
  margin: 10px 0 16px;
  font-size: 24px;
  line-height: 1.2;
  color: #ffe6c3;
}

.px-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.px-option-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 8px;
  display: grid;
  place-items: center;
  border: 3px solid #3d200e;
  background: #fff4d5;
}

.px-option--easy .px-option-icon {
  color: #0f7a34;
}

.px-option--hard .px-option-icon {
  color: #1358a8;
}

.px-option-label {
  margin: 0;
  font-size: 48px;
  line-height: 1;
}
</style>
