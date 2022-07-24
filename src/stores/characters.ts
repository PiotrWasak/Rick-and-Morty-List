import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import type { Result as Character } from "@/types/Characters";

type LocalFilterType = "name" | "id" | "episode";

export const useCharactersStore = defineStore({
  id: "characters",
  state: () => ({
    characters: [] as Array<Character>,
  }),
  persist: true,
  getters: {
    getCharacters: (state) => state.characters,
  },
  actions: {
    addCharacter(newCharacter: Character): void {
      if (!this.characters.find((value) => value.id === newCharacter.id)) {
        this.characters.push(newCharacter);
      }
    },
    removeCharacter(index: string): void {
      const characterToRemove = this.characters.findIndex(
        (character) => character.id === index
      );
      this.characters.splice(characterToRemove, 1);
    },
    filterBy(filterType: LocalFilterType, value: string) {
      return this.characters.filter(
        (character) => character[filterType] === value
      );
    },
  },
});