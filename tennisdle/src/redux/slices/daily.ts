import { createSlice } from "@reduxjs/toolkit";
import { DailyGame } from "../../typings/DailyGame";
import { getDateAsKey } from "../../utils/date";

export const dailyAtpSlice = createSlice({
  name: "daily-atp",
  initialState: {
    games: {} as Record<string, DailyGame>,
  },
  reducers: {
    checkGame: (state) => {
      const game = state.games[getDateAsKey()];
      if (!game) {
        const newGame: DailyGame = {
          date: getDateAsKey(),
          lives: 6,
          attempts: [],
          isWon: false,
        };
        state.games[getDateAsKey()] = newGame;
      }
    },
    addAttempt: (state, action) => {
      const game = state.games[getDateAsKey()];
      if (!game) return;
      if (game.isWon || game.lives === 0) return;
      const { attempt, toGuess } = action.payload;
      game.attempts.unshift(attempt);
      if (attempt === toGuess) game.isWon = true;
      else game.lives--;
    },
  },
});

export const { checkGame, addAttempt } = dailyAtpSlice.actions;
