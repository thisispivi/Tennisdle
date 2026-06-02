export interface Top10Entry {
  rank: number;
  player: string;
  value: number | string;
}

export interface LocalizedText {
  "en-US": string;
  "it-IT": string;
}

export interface Top10Game {
  id: string;
  date: string;
  titleOptions: LocalizedText;
  isAtp: boolean;
  players: Top10Entry[];
}
