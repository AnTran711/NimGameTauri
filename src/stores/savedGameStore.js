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

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useSavedGameStore = defineStore('savedGame', () => {
  const savedGames = ref([]);

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

      if (!fileExists) {
        savedGames.value = [];
        return;
      }

      const content = await readTextFile(SAVE_FILE, {
        baseDir: BaseDirectory.AppData
      });

      const parsed = JSON.parse(content);
      savedGames.value = Array.isArray(parsed) ? parsed : [];
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
        { baseDir: BaseDirectory.AppData }
      );
      return true;
    } catch (error) {
      console.error('Lỗi khi ghi file saved games:', error);
      return false;
    }
  }

  // Lưu 1 game mới
  async function saveGame(gameState, id = null) {
    await loadSavedGames();

    const targetId = id || makeId();
    const now = Date.now();

    const saveData = {
      id: targetId,
      timestamp: now,
      gameState: deepClone(gameState)
    };

    const index = savedGames.value.findIndex((g) => g.id === targetId);
    if (index === -1) {
      savedGames.value.unshift(saveData);
    } else {
      savedGames.value[index] = saveData;
    }

    const ok = await writeSavedGames();
    if (!ok) return null;

    return targetId;
  }

  // Xóa 1 game đã lưu theo id
  async function deleteSavedGame(id) {
    await loadSavedGames();
    savedGames.value = savedGames.value.filter((g) => g.id !== id);
    return await writeSavedGames();
  }

  // Lấy 1 game đã lưu theo id
  async function getSavedGame(id) {
    await loadSavedGames();
    const game = savedGames.value.find((g) => g.id === id);
    return game ? deepClone(game) : null;
  }

  return {
    savedGames,
    loadSavedGames,
    writeSavedGames,
    saveGame,
    deleteSavedGame,
    getSavedGame
  };
});
