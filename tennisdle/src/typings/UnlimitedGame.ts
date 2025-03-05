export type UnlimitedGame = {
  guessed: string[];
  toGuess: string;
  lives: number;
  attempts: string[];
  maxStreak: number;
  isWon: boolean;
};
