export interface GridCategory {
  id: string;
  labelKey: string;
  type: "country" | "tournament" | "hand" | "ranking" | "era";
}

export interface GridPuzzle {
  id: string;
  date?: string;
  rows: string[];
  cols: string[];
  solutions: Record<string, string[]>;
}

export interface GridCellState {
  playerName: string | null;
  isCorrect: boolean;
  isEmpty: boolean;
}
