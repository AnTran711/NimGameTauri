import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
  BaseDirectory
} from '@tauri-apps/plugin-fs';

const SAVE_DIR = 'nim-saves';
const SAVE_FILE = 'nim-saves/saved-games.json';

export const useSavedGameStore = defineStore('savedGame', () => {
  const savedGames = ref([]);
  const hasSaved = ref(false);

  // Đảm bảo thư mục lưu tồn tại
  async function ensureSaveDir() {
    const dirExists = await exists(SAVE_DIR, {
      baseDir: BaseDirectory.AppData
    });
    if (!dirExists) {
      await mkdir(SAVE_DIR, {
        baseDir: BaseDirectory.AppData,
        recursive: true
      });
    }
  }

  // Đọc danh sách game đã lưu từ file JSON
  async function loadSavedGames() {
    try {
      await ensureSaveDir();
      const fileExists = await exists(SAVE_FILE, {
        baseDir: BaseDirectory.AppData
      });
      if (fileExists) {
        const content = await readTextFile(SAVE_FILE, {
          baseDir: BaseDirectory.AppData
        });
        savedGames.value = JSON.parse(content);
      } else {
        savedGames.value = [];
      }
    } catch (error) {
      console.error('Lỗi khi đọc file saved games:', error);
      savedGames.value = [];
    }
  }

  // Ghi danh sách game đã lưu ra file JSON
  async function writeSavedGames() {
    try {
      await ensureSaveDir();
      await writeTextFile(
        SAVE_FILE,
        JSON.stringify(savedGames.value, null, 2),
        {
          baseDir: BaseDirectory.AppData
        }
      );
    } catch (error) {
      console.error('Lỗi khi ghi file saved games:', error);
      savedGames.value.pop();
    }
  }

  // Lưu 1 game mới
  async function saveGame(gameState) {
    await loadSavedGames();

    const now = Date.now();
    const saveData = {
      id: now.toString(),
      timestamp: now,
      isActive: false,
      gameState: { ...gameState }
    };

    const gameActiveIdx = savedGames.value.findIndex(
      (g) => g.isActive === true
    );

    if (gameActiveIdx === -1) {
      savedGames.value.push(saveData);
    } else {
      savedGames.value[gameActiveIdx] = saveData;
    }

    await writeSavedGames();
    hasSaved.value = true;
  }

  // Xóa 1 game đã lưu theo id
  async function deleteSavedGame(id) {
    savedGames.value = savedGames.value.filter((g) => g.id !== id);
    await writeSavedGames();
  }

  // Lấy 1 game đã lưu theo id
  async function getSavedGame(id) {
    const gameActiveIdx = savedGames.value.findIndex((g) => g.id === id);
    savedGames.value[gameActiveIdx].isActive = true;
    await writeSavedGames();
    return savedGames.value[gameActiveIdx];
  }

  return {
    savedGames,
    hasSaved,
    loadSavedGames,
    writeSavedGames,
    saveGame,
    deleteSavedGame,
    getSavedGame
  };
});
