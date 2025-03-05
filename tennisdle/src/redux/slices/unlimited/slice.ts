import { createSlice } from "@reduxjs/toolkit";
import { UnlimitedGame } from "../../../typings/UnlimitedGame";
import { atpPlayers, wtaPlayers } from "../../../assets";

const getRandomPlayer = (isAtp: boolean, game?: UnlimitedGame) => {
  const players = isAtp ? atpPlayers : wtaPlayers;
  const notGuessed = players.filter(
    (player) => !game?.guessed.includes(player.player)
  );
  const randomIndex = Math.floor(Math.random() * notGuessed.length);
  return notGuessed[randomIndex].player;
};

const initializeGame = (isAtp: boolean) => {
  return {
    guessed: [],
    toGuess: getRandomPlayer(isAtp),
    lives: 6,
    attempts: [],
    maxStreak: 0,
    isWon: false,
  };
};

export const unlimitedSlice = createSlice({
  name: "unlimited",
  initialState: {
    atpGame: {} as UnlimitedGame,
    wtaGame: {} as UnlimitedGame,
  },
  reducers: {
    checkGame: (state, action) => {
      const { isAtp } = action.payload;
      const gameKey = isAtp ? "atpGame" : "wtaGame";
      const game = state[gameKey];
      if (Object.keys(game).length === 0)
        state[gameKey] = initializeGame(isAtp);
    },
    addAttempt: (state, action) => {
      const { isAtp, attempt } = action.payload;
      const gameKey = isAtp ? "atpGame" : "wtaGame";
      const game = state[gameKey];
      if (!game || game.lives === 0) return;
      game.attempts.unshift(attempt);
      if (attempt === game.toGuess) {
        game.guessed.push(attempt);
        game.isWon = true;
        game.maxStreak = Math.max(game.maxStreak, game.guessed.length);
      } else {
        game.lives--;
      }
    },
    continueGame: (state, action) => {
      const { isAtp } = action.payload;
      const gameKey = isAtp ? "atpGame" : "wtaGame";
      const game = state[gameKey];
      if (game.lives === 0) {
        game.guessed = [];
        game.maxStreak = 0;
      } else {
        game.isWon = false;
      }
      game.attempts = [];
      game.lives = 6;
      setTimeout(() => {
        game.toGuess = getRandomPlayer(isAtp, game);
      }, 300);
    },
    setNextPlayer: (state, action) => {
      const { isAtp } = action.payload;
      const gameKey = isAtp ? "atpGame" : "wtaGame";
      const game = state[gameKey];
      game.toGuess = getRandomPlayer(isAtp, game);
    },
  },
});

export const { checkGame, addAttempt, continueGame, setNextPlayer } =
  unlimitedSlice.actions;
