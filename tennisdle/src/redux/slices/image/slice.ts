import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getDateAsKey } from "../../../utils/date";

const BLUR_LEVELS = [20, 16, 12, 8, 4, 0];
const NUM_LIVES = 6;

interface ImageGame {
  date: string;
  currentPlayer: string;
  lives: number;
  attempts: string[];
  blurLevel: number;
  isWon: boolean;
  isSurrendered: boolean;
}

interface CheckGamePayload {
  isAtp: boolean;
  playerName: string;
}

const initializeGame = (playerName: string): ImageGame => ({
  date: getDateAsKey(),
  currentPlayer: playerName,
  lives: NUM_LIVES,
  attempts: [],
  blurLevel: BLUR_LEVELS[0],
  isWon: false,
  isSurrendered: false,
});

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    atpGames: {} as Record<string, ImageGame>,
    wtaGames: {} as Record<string, ImageGame>,
  },
  reducers: {
    checkGame: (state, action: PayloadAction<CheckGamePayload>) => {
      const { isAtp, playerName } = action.payload;
      const gameKey = isAtp ? "atpGames" : "wtaGames";
      const dateKey = getDateAsKey();
      if (!state[gameKey][dateKey]) {
        state[gameKey][dateKey] = initializeGame(playerName);
      }
    },
    addAttempt: (
      state,
      action: PayloadAction<{ isAtp: boolean; attempt: string }>
    ) => {
      const { isAtp, attempt } = action.payload;
      const gameKey = isAtp ? "atpGames" : "wtaGames";
      const game = state[gameKey][getDateAsKey()];
      if (!game || game.isWon || game.lives === 0) return;

      game.attempts.unshift(attempt);
      if (attempt === game.currentPlayer) {
        game.isWon = true;
        game.blurLevel = 0;
      } else {
        game.lives--;
        const blurIndex = NUM_LIVES - game.lives;
        game.blurLevel = BLUR_LEVELS[Math.min(blurIndex, BLUR_LEVELS.length - 1)];
      }
    },
    surrender: (state, action: PayloadAction<{ isAtp: boolean }>) => {
      const { isAtp } = action.payload;
      const gameKey = isAtp ? "atpGames" : "wtaGames";
      const game = state[gameKey][getDateAsKey()];
      if (!game || game.isWon || game.lives === 0) return;
      game.lives = 0;
      game.blurLevel = 0;
      game.isSurrendered = true;
    },
  },
});

export const { checkGame, addAttempt, surrender } = imageSlice.actions;
