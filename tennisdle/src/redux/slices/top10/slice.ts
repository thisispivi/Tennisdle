import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getDateAsKey } from "../../../utils/date";

const NUM_LIVES = 6;

interface Top10Game {
  date: string;
  categoryId: string;
  guessedPlayers: string[];
  lives: number;
  wrongAttempts: string[];
  isComplete: boolean;
}

const initializeGame = (categoryId: string): Top10Game => ({
  date: getDateAsKey(),
  categoryId,
  guessedPlayers: [],
  lives: NUM_LIVES,
  wrongAttempts: [],
  isComplete: false,
});

export const top10Slice = createSlice({
  name: "top10",
  initialState: {
    games: {} as Record<string, Top10Game>,
  },
  reducers: {
    checkGame: (state, action: PayloadAction<{ categoryId: string }>) => {
      const dateKey = getDateAsKey();
      if (!state.games[dateKey]) {
        state.games[dateKey] = initializeGame(action.payload.categoryId);
      }
    },
    addAttempt: (
      state,
      action: PayloadAction<{
        attempt: string;
        validPlayers: string[];
      }>
    ) => {
      const { attempt, validPlayers } = action.payload;
      const game = state.games[getDateAsKey()];
      if (!game || game.isComplete || game.lives === 0) return;

      if (game.guessedPlayers.includes(attempt) || game.wrongAttempts.includes(attempt)) return;

      if (validPlayers.includes(attempt)) {
        game.guessedPlayers.push(attempt);
        if (game.guessedPlayers.length === 10) {
          game.isComplete = true;
        }
      } else {
        game.wrongAttempts.push(attempt);
        game.lives--;
      }
    },
    surrender: (state) => {
      const game = state.games[getDateAsKey()];
      if (!game || game.isComplete || game.lives === 0) return;
      game.lives = 0;
    },
  },
});

export const { checkGame, addAttempt, surrender } = top10Slice.actions;
