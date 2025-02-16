export const countries = {
  Argentina: "AR",
  Australia: "AU",
  Austria: "AT",
  Belarus: "BY",
  Belgium: "BE",
  Brazil: "BR",
  Bulgaria: "BG",
  Canada: "CA",
  Chile: "CL",
  China: "CN",
  Croatia: "HR",
  CzechRepublic: "CZ",
  Denmark: "DK",
  Ecuador: "EC",
  Estonia: "EE",
  France: "FR",
  Germany: "DE",
  GreatBritain: "GB",
  Greece: "GR",
  Italy: "IT",
  Japan: "JP",
  Latvia: "LV",
  Mexico: "MX",
  Netherlands: "NL",
  NewZealand: "NZ",
  Norway: "NO",
  Poland: "PL",
  Romania: "RO",
  Russia: "RU",
  Serbia: "RS",
  Slovakia: "SK",
  Slovenia: "SI",
  SouthAfrica: "ZA",
  Spain: "ES",
  Sweden: "SE",
  Switzerland: "CH",
  Tunisia: "TN",
  Ukraine: "UA",
  UnitedStates: "US",
};

const continents: Record<string, string[]> = {
  Europe: [
    "AT",
    "BE",
    "BG",
    "BY",
    "CH",
    "CZ",
    "DE",
    "DK",
    "EE",
    "ES",
    "FR",
    "GB",
    "GR",
    "HR",
    "IT",
    "LV",
    "NL",
    "NO",
    "PL",
    "RO",
    "RS",
    "RU",
    "SE",
    "SI",
    "SK",
    "UA",
  ],
  NorthAmerica: ["CA", "MX", "US"],
  SouthAmerica: ["AR", "BR", "CL", "EC"],
  Asia: ["CN", "JP"],
  Oceania: ["AU", "NZ"],
  Africa: ["TN", "ZA"],
};

/**
 * Returns the continent of a given country.
 * @param {string} country - The country to get the continent of.
 * @returns {string | undefined} The continent of the given country.
 */
export function getContinent(country: string): string | undefined {
  return Object.keys(continents).find((continent) =>
    continents[continent as keyof typeof continents].includes(
      countries[country as keyof typeof countries]
    )
  );
}

/**
 * Returns whether two countries are in the same continent.
 * @param {string} country1 - The first country to compare.
 * @param {string} country2 - The second country to compare.
 * @returns {boolean} Whether the two countries are in the same continent.
 */
export function areCountriesInSameContinent(
  country1: string,
  country2: string
): boolean {
  return getContinent(country1) === getContinent(country2);
}
