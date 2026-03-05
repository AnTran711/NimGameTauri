import { initHeaps } from '@/logic/initHeaps';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initFirstPlayer } from '@/logic/initFirstPlayer';
import { applyMove, isGameOver, normalCheckWinner } from '@/logic/nimLogic';
import { misereCheckWinner } from '@/logic/misereLogic';
import { getEasyMove, getHardMove } from '@/ai';

export const useGameStore = defineStore('game', () => {
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

  // actions
  function startNewGame({ mode = 'PVP', vra = 'normal', level = 'easy' } = {}) {
    heaps.value = initHeaps();
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

  function handleGameOver() {
    gameOver.value = true;
    isGameStarted.value = false;

    // 2 truong hop: normal || misere
    if (variant.value === 'normal') {
      winner.value = normalCheckWinner(heaps.value, currentPlayer.value);
    } else {
      winner.value = misereCheckWinner(heaps.value, currentPlayer.value);
    }
  }

  function aiMove() {
    let move;

    if (aiLevel.value === 'easy') {
      move = getEasyMove(heaps.value);
    } else {
      move = getHardMove(heaps.value, variant.value);
    }

    setTimeout(() => {
      makeMove(move.heapIndex, move.removeCount);
    }, 200);
  }

  // === SAVE / LOAD ===

  // Xuất toàn bộ state hiện tại thành object để lưu
  function exportGameState() {
    return {
      heaps: JSON.parse(JSON.stringify(heaps.value)),
      currentPlayer: currentPlayer.value,
      gameOver: gameOver.value,
      winner: winner.value,
      gameMode: gameMode.value,
      variant: variant.value,
      aiLevel: aiLevel.value,
      historyMoves: JSON.parse(JSON.stringify(historyMoves.value))
    };
  }

  // Nạp state từ object đã lưu vào store
  function importGameState(state) {
    if (!state || !state.heaps) {
      console.error('importGameState: state không hợp lệ', state);
      return;
    }
    heaps.value = state.heaps;
    currentPlayer.value = state.currentPlayer;
    gameOver.value = state.gameOver;
    winner.value = state.winner;
    gameMode.value = state.gameMode;
    variant.value = state.variant;
    aiLevel.value = state.aiLevel;
    historyMoves.value = state.historyMoves;
    activeHeapId.value = null;
    selectedStones.value = {};
    isGameStarted.value = true;
    isChanged.value = false;
  }

  // Kiểm tra game có đang chơi dở không (chưa kết thúc VÀ đã có nước đi)
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
    startNewGame,
    makeMove,
    switchPlayer,
    handleGameOver,
    aiMove,
    exportGameState,
    importGameState,
    isGameInProgress
  };
});
