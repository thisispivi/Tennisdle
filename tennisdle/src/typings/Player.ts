export interface Player {
  player: string;
  country: string | null;
  birthDate: number;
  height: number | null;
  yearTurnedPro: number | null;
  yearRetired: number | null;
  isRightHanded: boolean | null;
  isTwoHandedBackhand: boolean | null;
  careerTitles: number | null;
  highestRanking: number | null;
  noAusOpenTitles: number;
  noFrenchOpenTitles: number;
  noWimbledonTitles: number;
  noUSOpenTitles: number;
  noTourFinalsTitles: number;
  noOlympicTitles: number;
  image: string;
}

export type Players = Player[];

export const categories: (keyof Player)[] = [
  "height",
  // "yearTurnedPro",
  "birthDate",
  "country",
  // "yearRetired",
  // "careerTitles",
  // "highestRanking",
  // "isRightHanded",
  // "isTwoHandedBackhand",
  "noAusOpenTitles",
  "noFrenchOpenTitles",
  "noWimbledonTitles",
  "noUSOpenTitles",
  "noTourFinalsTitles",
  "noOlympicTitles",
  "isRightHanded",
  "isTwoHandedBackhand",
];
