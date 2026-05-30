import { Player } from "../typings/Player";

type PlayerFilter = (player: Player) => boolean;

export const gridFilters: Record<string, PlayerFilter> = {
  "won-australian-open": (p) => p.noAusOpenTitles > 0,
  "won-french-open": (p) => p.noFrenchOpenTitles > 0,
  "won-wimbledon": (p) => p.noWimbledonTitles > 0,
  "won-us-open": (p) => p.noUSOpenTitles > 0,
  "left-handed": (p) => p.isRightHanded === false,
  "right-handed": (p) => p.isRightHanded === true,
  "european": (p) => {
    const europeanCountries = [
      "Spain", "Switzerland", "Serbia", "Germany", "France", "United Kingdom",
      "Sweden", "Czech Republic", "Croatia", "Russia", "Austria", "Italy",
      "Netherlands", "Belgium", "Romania", "Greece", "Norway", "Denmark",
      "Finland", "Poland", "Hungary", "Bulgaria", "Slovakia", "Ukraine",
      "Belarus", "Bosnia and Herzegovina", "Montenegro", "Slovenia",
      "Georgia", "Latvia", "Lithuania", "Estonia", "Portugal",
    ];
    return p.country !== null && europeanCountries.includes(p.country);
  },
  "american": (p) => {
    const americanCountries = [
      "United States", "Argentina", "Brazil", "Chile", "Canada",
      "Colombia", "Ecuador", "Peru", "Venezuela", "Mexico",
      "Dominican Republic", "Uruguay", "Paraguay", "Bolivia",
    ];
    return p.country !== null && americanCountries.includes(p.country);
  },
  "top-5-ranking": (p) => p.highestRanking !== null && p.highestRanking <= 5,
  "number-1": (p) => p.highestRanking === 1,
  "10-plus-titles": (p) => p.careerTitles !== null && p.careerTitles >= 10,
  "one-handed-backhand": (p) => p.isTwoHandedBackhand === false,
  "won-olympic-gold": (p) => p.noOlympicTitles > 0,
  "won-tour-finals": (p) => p.noTourFinalsTitles > 0,
  "spanish": (p) => p.country === "Spain",
  "swiss": (p) => p.country === "Switzerland",
  "serbian": (p) => p.country === "Serbia",
  "australian": (p) => p.country === "Australia",
};
