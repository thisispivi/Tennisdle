export interface Player {
  player: string;
  country: string | null;
  birthDate: number;
  height: string | null;
  yearTurnedPro: string | null;
  yearRetired: string | null;
  isRightHanded: boolean | null;
  isTwoHandedBackhand: boolean | null;
  careerTitles: string;
  highestRanking: string | null;
  noAusOpenTitles: number;
  noFrenchOpenTitles: number;
  noWimbledonTitles: number;
  noUSOpenTitles: number;
  noTourFinalsTitles: number;
  noOlympicTitles: number;
  image: string;
}

export type Players = Player[];
