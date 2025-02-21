import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DailyGame } from "../../../typings/DailyGame";
import { getDateAsKey } from "../../../utils/date";
import { NUM_LIVES } from "../../../utils/params";

interface CheckGamePayload {
  isAtp: boolean;
}

interface AddAttemptPayload {
  isAtp: boolean;
  attempt: string;
  toGuess: string;
}

const initializeGame = (): DailyGame => ({
  date: getDateAsKey(),
  lives: NUM_LIVES,
  attempts: [],
  isWon: false,
});

export const dailySlice = createSlice({
  name: "daily",
  initialState: {
    atpGames: {} as Record<string, DailyGame>,
    wtaGames: {} as Record<string, DailyGame>,
  },
  reducers: {
    checkGame: (state, action: PayloadAction<CheckGamePayload>) => {
      const { isAtp } = action.payload;
      const gameKey = isAtp ? "atpGames" : "wtaGames";
      const game = state[gameKey][getDateAsKey()];
      if (!game) {
        state[gameKey][getDateAsKey()] = initializeGame();
      }
    },
    addAttempt: (state, action: PayloadAction<AddAttemptPayload>) => {
      const { isAtp, attempt, toGuess } = action.payload;
      const gameKey = isAtp ? "atpGames" : "wtaGames";
      const game = state[gameKey][getDateAsKey()];
      if (!game || game.isWon || game.lives === 0) return;
      game.attempts.unshift(attempt);
      if (attempt === toGuess) {
        game.isWon = true;
      } else {
        game.lives--;
      }
    },
  },
});

export const { checkGame, addAttempt } = dailySlice.actions;
