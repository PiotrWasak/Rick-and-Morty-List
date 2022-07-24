import type { FilterType, Result } from "@/types/Characters";

export type Events = {
  addToFavorites: Result;
  removeFromFavorites: Result;
  search: string;
  changeSelect: FilterType;
  logoClicked: void;
  resetSearchBar: void;
};
