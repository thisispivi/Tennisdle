export interface Top10Entry {
  rank: number;
  player: string;
  value: number | string;
}

export interface Top10Category {
  id: string;
  titleKey: string;
  isAtp: boolean;
  players: Top10Entry[];
}
