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

    if (gameMode.value === 'PVE' && currentPlayer.value === 2) {
      aiMove();
    }
  }

  function makeMove(heapIndex, amount) {
    if (gameOver.value) return;

    heaps.value = applyMove(heaps.value, heapIndex, amount);

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
    startNewGame,
    makeMove,
    switchPlayer,
    handleGameOver,
    aiMove
  };
});
