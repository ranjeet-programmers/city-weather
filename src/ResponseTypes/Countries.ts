interface Name {
  common: string;
  nativeName: object;
  official: string;
}

interface FlagType {
  png: string;
  svg: string;
}
export interface CountryType {
  altSpellings: Array<string>;
  area: number;
  borders: Array<string>;
  capital: Array<string>;
  capitalInfo: object;
  flag: FlagType;
  gini: object;
  idd: object;
  independent: boolean;
  landlocked: boolean;
  languages: object;
  latlng: Array<number>;
  maps: object;
  name: Name;
  population: number;
  postalCode: object;
  region: string;
  startOfWeek: string;
  status: string;
  subregion: string;
  timezones: Array<string>;
  unMember: boolean;
}

export type CountriesType = CountryType[];
