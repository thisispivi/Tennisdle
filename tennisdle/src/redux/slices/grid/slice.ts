import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GridCellState } from "../../../typings/Grid";
import { getDateAsKey } from "../../../utils/date";

interface GridGame {
  date: string;
  puzzleId: string;
  cells: GridCellState[][];
  guessesUsed: number;
  score: number;
  usedPlayers: string[];
  isComplete: boolean;
}

const createEmptyGrid = (): GridCellState[][] =>
  Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => ({
      playerName: null,
      isCorrect: false,
      isEmpty: true,
    }))
  );

const initializeGame = (puzzleId: string): GridGame => ({
  date: getDateAsKey(),
  puzzleId,
  cells: createEmptyGrid(),
  guessesUsed: 0,
  score: 0,
  usedPlayers: [],
  isComplete: false,
});

export const gridSlice = createSlice({
  name: "grid",
  initialState: {
    games: {} as Record<string, GridGame>,
  },
  reducers: {
    checkGame: (state, action: PayloadAction<{ puzzleId: string }>) => {
      const dateKey = getDateAsKey();
      if (!state.games[dateKey]) {
        state.games[dateKey] = initializeGame(action.payload.puzzleId);
      }
    },
    guessCell: (
      state,
      action: PayloadAction<{
        row: number;
        col: number;
        playerName: string;
        validPlayers: string[];
      }>
    ) => {
      const { row, col, playerName, validPlayers } = action.payload;
      const game = state.games[getDateAsKey()];
      if (!game || game.isComplete) return;

      const cell = game.cells[row][col];
      if (!cell.isEmpty) return;

      if (game.usedPlayers.includes(playerName)) return;

      cell.playerName = playerName;
      cell.isEmpty = false;
      cell.isCorrect = validPlayers.includes(playerName);
      game.guessesUsed++;
      game.usedPlayers.push(playerName);

      if (cell.isCorrect) {
        game.score++;
      }

      const allFilled = game.cells.every((row) =>
        row.every((cell) => !cell.isEmpty)
      );
      if (allFilled) {
        game.isComplete = true;
      }
    },
  },
});

export const { checkGame, guessCell } = gridSlice.actions;
