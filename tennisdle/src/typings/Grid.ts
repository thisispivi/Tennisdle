import { LocalizedText } from "./Top10";

export interface GridLabel {
  id: string;
  label: LocalizedText;
  shortLabel: LocalizedText;
}

export interface GridPuzzle {
  id: string;
  date: string;
  rows: GridLabel[];
  cols: GridLabel[];
  solutions: Record<string, string[]>;
}

export interface GridCellState {
  playerName: string | null;
  isCorrect: boolean;
  isEmpty: boolean;
}
