import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getDateAsKey } from "../../../utils/date";

const NUM_LIVES = 6;

interface VenueGame {
  date: string;
  currentVenueId: string;
  lives: number;
  hintsRevealed: number;
  attempts: string[];
  isWon: boolean;
  isSurrendered: boolean;
}

const initializeGame = (venueId: string): VenueGame => ({
  date: getDateAsKey(),
  currentVenueId: venueId,
  lives: NUM_LIVES,
  hintsRevealed: 0,
  attempts: [],
  isWon: false,
  isSurrendered: false,
});

export const venueSlice = createSlice({
  name: "venue",
  initialState: {
    games: {} as Record<string, VenueGame>,
  },
  reducers: {
    checkGame: (state, action: PayloadAction<{ venueId: string }>) => {
      const dateKey = getDateAsKey();
      if (!state.games[dateKey]) {
        state.games[dateKey] = initializeGame(action.payload.venueId);
      }
    },
    addAttempt: (state, action: PayloadAction<{ attempt: string; correctTournament: string }>) => {
      const { attempt, correctTournament } = action.payload;
      const game = state.games[getDateAsKey()];
      if (!game || game.isWon || game.lives === 0) return;

      game.attempts.unshift(attempt);
      if (attempt.toLowerCase() === correctTournament.toLowerCase()) {
        game.isWon = true;
      } else {
        game.lives--;
        game.hintsRevealed = Math.min(game.hintsRevealed + 1, 5);
      }
    },
    surrender: (state) => {
      const game = state.games[getDateAsKey()];
      if (!game || game.isWon || game.lives === 0) return;
      game.lives = 0;
      game.isSurrendered = true;
    },
  },
});

export const { checkGame, addAttempt, surrender } = venueSlice.actions;
