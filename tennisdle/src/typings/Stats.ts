export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesSurrendered: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

export interface AllStats {
  dailyAtp: GameStats;
  dailyWta: GameStats;
  unlimitedAtp: GameStats;
  unlimitedWta: GameStats;
}
