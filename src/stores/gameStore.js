import { initHeaps } from '@/logic/initHeaps';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initFirstPlayer } from '@/logic/initFirstPlayer';
import { applyMove, isGameOver, normalCheckWinner } from '@/logic/nimLogic';
import { misereCheckWinner } from '@/logic/misereLogic';
import { getEasyMove, getHardMove } from '@/ai';
import { useSavedGameStore } from '@/stores/savedGameStore';
import { useGameSettingsStore } from '@/stores/gameSettingsStore';

const AI_MOVE_DELAY_MS = 400;

export const useGameStore = defineStore('game', () => {
  const gameSettingsStore = useGameSettingsStore();

  // states
  const heaps = ref([]); // [{id: , stones: },...]
  const currentPlayer = ref(1); // PVP: 1 -> player1, 2 -> player2 || PVE: 1 -> human, 2 -> computer
  const gameOver = ref(false);
  const winner = ref(null);

  const gameMode = ref('PVP'); // nguoi vs nguoi (PVP) | nguoi vs may (PVE)
  const variant = ref('normal'); // normal | misere
  const aiLevel = ref('easy'); // easy | hard

  const activeHeapId = ref(null); // đống đang được chọn
  const selectedStones = ref({}); // { heapId: [stoneIndex1, stoneIndex2, ...] }

  const historyMoves = ref([]); // biến lưu lịch sử nước đi

  // Cờ đánh dấu game đã bắt đầu (dùng cho việc hỏi lưu khi thoát)
  const isGameStarted = ref(false);

  const isChanged = ref(false); // Cờ đánh dấu có thay đổi nào đó so với lúc bắt đầu hay không

  const currentGameId = ref(null); // ID của game đang chơi

  const gameRenderKey = ref(0); // Key để ép component render lại khi load game mới

  const pendingAIMove = ref(null); // Biến lưu nước đi của AI đang chờ thực hiện (để tránh gọi AI nhiều lần khi load game)
  const aiMoveTimerId = ref(null); // Biến lưu ID của timer đang chờ thực hiện nước đi của AI

  // actions
  function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function clearAIMoveTimer() {
    if (aiMoveTimerId.value !== null) {
      clearTimeout(aiMoveTimerId.value);
      aiMoveTimerId.value = null;
    }
  }

  function startNewGame({ mode = 'PVP', vra = 'normal', level = 'easy' } = {}) {
    clearAIMoveTimer();

    gameRenderKey.value++; // Tăng key để ép render lại nếu cần
    heaps.value = initHeaps({
      minHeaps: gameSettingsStore.minHeaps,
      maxHeaps: gameSettingsStore.maxHeaps,
      minStones: gameSettingsStore.minStones,
      maxStones: gameSettingsStore.maxStones
    });
    gameMode.value = mode;
    variant.value = vra;
    aiLevel.value = level;
    currentPlayer.value = initFirstPlayer();
    gameOver.value = false;
    winner.value = null;
    activeHeapId.value = null;
    selectedStones.value = {};
    historyMoves.value = [];
    isGameStarted.value = true;
    isChanged.value = false;
    currentGameId.value = null;
    pendingAIMove.value = null;

    if (gameMode.value === 'PVE' && currentPlayer.value === 2) {
      aiMove();
    }
  }

  function makeMove(heapIndex, amount) {
    if (gameOver.value) return;

    heaps.value = applyMove(heaps.value, heapIndex, amount);
    isChanged.value = true;

    // Tạo thông tin 1 nước đi để lưu vào lịch sử
    const moveInfo = {
      moveNumber: historyMoves.value.length + 1,
      player:
        gameMode.value === 'PVP'
          ? `Người chơi ${currentPlayer.value}`
          : currentPlayer.value === 1
            ? 'Người'
            : 'Máy',
      heapId: heapIndex + 1,
      stonesBefore: heaps.value[heapIndex].stones + amount,
      stonesRemoved: amount,
      stonesAfter: heaps.value[heapIndex].stones
    };

    historyMoves.value.push(moveInfo);

    if (isGameOver(heaps.value)) {
      handleGameOver();
    } else {
      switchPlayer();
      if (gameMode.value === 'PVE' && currentPlayer.value === 2) {
        aiMove();
      }
    }
  }

  function switchPlayer() {
    currentPlayer.value = currentPlayer.value === 1 ? 2 : 1;
  }

  async function handleGameOver() {
    clearAIMoveTimer();
    pendingAIMove.value = null;

    gameOver.value = true;
    isGameStarted.value = false;

    // 2 truong hop: normal || misere
    if (variant.value === 'normal') {
      winner.value = normalCheckWinner(heaps.value, currentPlayer.value);
    } else {
      winner.value = misereCheckWinner(heaps.value, currentPlayer.value);
    }

    // Nếu game kết thúc thì xóa game khỏi lịch sử lưu nếu có
    if (currentGameId.value) {
      const savedGameStore = useSavedGameStore();
      const idToDelete = currentGameId.value;
      currentGameId.value = null;
      try {
        await savedGameStore.deleteSavedGame(idToDelete);
      } catch (error) {
        console.error('Xóa save khi game kết thúc thất bại:', error);
      }
    }
  }

  function aiMove() {
    clearAIMoveTimer();

    if (
      gameMode.value !== 'PVE' ||
      currentPlayer.value !== 2 ||
      gameOver.value
    ) {
      return;
    }

    aiMoveTimerId.value = setTimeout(() => {
      aiMoveTimerId.value = null;

      if (
        gameMode.value !== 'PVE' ||
        currentPlayer.value !== 2 ||
        gameOver.value
      ) {
        return;
      }

      let move;
      if (aiLevel.value === 'easy') {
        move = getEasyMove(heaps.value);
      } else {
        move = getHardMove(heaps.value, variant.value);
      }

      if (!move || move.heapIndex < 0 || move.removeCount <= 0) return;

      const heap = heaps.value[move.heapIndex];
      if (!heap || heap.stones <= 0) return;

      pendingAIMove.value = {
        heapIndex: move.heapIndex,
        heapId: heap.id,
        removeCount: move.removeCount
      };
    }, AI_MOVE_DELAY_MS);
  }

  // Hàm này sẽ được gọi sau khi animation đá hoàn thành để thực sự thực hiện nước đi của AI
  function commitAIMove() {
    if (!pendingAIMove.value) return;
    if (
      gameOver.value ||
      gameMode.value !== 'PVE' ||
      currentPlayer.value !== 2
    ) {
      pendingAIMove.value = null;
      return;
    }
    const move = pendingAIMove.value;
    pendingAIMove.value = null;
    makeMove(move.heapIndex, move.removeCount);
  }

  // === SAVE / LOAD ===

  // Xuất toàn bộ state hiện tại thành object để lưu
  function exportGameState() {
    return {
      heaps: deepClone(heaps.value),
      currentPlayer: currentPlayer.value,
      gameOver: gameOver.value,
      winner: winner.value,
      gameMode: gameMode.value,
      variant: variant.value,
      aiLevel: aiLevel.value,
      historyMoves: deepClone(historyMoves.value)
    };
  }

  // Nạp state từ object đã lưu vào store
  function importGameState(state, id = null) {
    if (!state || !Array.isArray(state.heaps)) {
      console.error('importGameState: state không hợp lệ', state);
      return;
    }

    clearAIMoveTimer();

    heaps.value = deepClone(state.heaps);
    currentPlayer.value = state.currentPlayer ?? 1;
    gameOver.value = !!state.gameOver;
    winner.value = state.winner ?? null;
    gameMode.value = state.gameMode ?? 'PVP';
    variant.value = state.variant ?? 'normal';
    aiLevel.value = state.aiLevel ?? 'easy';
    historyMoves.value = deepClone(state.historyMoves ?? []);
    activeHeapId.value = null;
    selectedStones.value = {};
    isGameStarted.value = !gameOver.value;
    isChanged.value = false;
    currentGameId.value = id;
    pendingAIMove.value = null;

    if (gameMode.value === 'PVE' && currentPlayer.value === 2) {
      aiMove();
    }
  }

  // Kiểm tra game có đang chơi dở không (chưa kết thúc và đã có nước đi)
  function isGameInProgress() {
    return (
      isGameStarted.value && !gameOver.value && historyMoves.value.length > 0
    );
  }

  return {
    heaps,
    currentPlayer,
    gameOver,
    winner,
    gameMode,
    variant,
    aiLevel,
    activeHeapId,
    selectedStones,
    historyMoves,
    isGameStarted,
    isChanged,
    currentGameId,
    gameRenderKey,
    pendingAIMove,
    startNewGame,
    makeMove,
    switchPlayer,
    handleGameOver,
    aiMove,
    exportGameState,
    importGameState,
    isGameInProgress,
    commitAIMove
  };
});
