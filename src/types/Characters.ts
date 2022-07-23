export interface Characters {
  __typename: string;
  info: Info;
  results: Result[];
}

export interface Info {
  __typename: string;
  count: number;
  pages: number;
  next: number;
  prev: null;
}

export interface Result {
  __typename: ResultTypename;
  image: string;
  id: string;
  name: string;
  gender: Gender;
  species: Species;
  status: Status;
  episode: Episode[];
}

export enum ResultTypename {
  Character = "Character",
}

export interface Episode {
  __typename: EpisodeTypename;
  episode: string;
}

export enum EpisodeTypename {
  Episode = "Episode",
}

export enum Gender {
  Female = "Female",
  Male = "Male",
  Unknown = "unknown",
}

export enum Species {
  Alien = "Alien",
  Human = "Human",
}

export enum Status {
  Alive = "Alive",
  Dead = "Dead",
  Unknown = "unknown",
}

export type FilterType = "Name" | "Identifier" | "Episode";