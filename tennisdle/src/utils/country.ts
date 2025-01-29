export const countries = {
  Argentina: "AR",
  Australia: "AU",
  Austria: "AT",
  Belgium: "BE",
  Brazil: "BR",
  Bulgaria: "BG",
  Canada: "CA",
  Chile: "CL",
  Croatia: "HR",
  CzechRepublic: "CZ",
  Czechoslovakia: "CS",
  Denmark: "DK",
  Ecuador: "EC",
  France: "FR",
  Germany: "DE",
  GreatBritain: "GB",
  Greece: "GR",
  Italy: "IT",
  Mexico: "MX",
  Netherlands: "NL",
  NewZealand: "NZ",
  Norway: "NO",
  Poland: "PL",
  Romania: "RO",
  Russia: "RU",
  Serbia: "RS",
  Slovakia: "SK",
  SouthAfrica: "ZA",
  Spain: "ES",
  Sweden: "SE",
  Switzerland: "CH",
  Ukraine: "UA",
  UnitedStates: "US",
  WestGermany: "DE",
  Yugoslavia: "YU",
};

const continents: Record<string, string[]> = {
  Europe: [
    "AT",
    "BE",
    "BG",
    "HR",
    "CZ",
    "DK",
    "FR",
    "DE",
    "GB",
    "GR",
    "IT",
    "NL",
    "NO",
    "PL",
    "RO",
    "RU",
    "RS",
    "SK",
    "ES",
    "SE",
    "CH",
    "UA",
    "YU",
  ],
  NorthAmerica: ["CA", "MX", "US"],
  Oceania: ["AU", "NZ"],
  SouthAmerica: ["AR", "BR", "CL", "EC"],
  Africa: ["ZA"],
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
