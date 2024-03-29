<template>
  <div class="home-wrapper">
    <TheHeader class="home-view-margin"></TheHeader>
    <v-divider></v-divider>
    <BaseNavbar
      class="mt-5 home-view-margin"
      :tabs="tabs"
      v-model="activeTabIndex"
    ></BaseNavbar>
    <div class="loading" v-if="loading || episodeLoading || characterLoading">
      <span>Loading...</span>
      <img src="/images/spinner.svg" alt="loading" />
    </div>
    <div v-else>
      <CharactersTable
        v-if="tableData?.length > 0"
        class="mt-5"
        :headers="tableHeaders"
        :items="tableData"
      ></CharactersTable>
      <div
        v-else
        class="base-text-secondary mt-16 d-flex flex-column justify-center align-center"
      >
        <img
          alt="No result image"
          width="300"
          src="/images/no-result-img.png"
        />
        <span class="mt-6">No results</span>
      </div>
      <div class="base-text-secondary mt-16 home-view-margin pagination-width">
        <v-pagination
          class="ml-16"
          v-if="totalPages > 1"
          next-icon="mdi-play"
          prev-icon="mdi-play mdi-rotate-180"
          v-model="currentPage"
          :length="totalPages"
        ></v-pagination>
      </div>
    </div>
    <Teleport to=".v-main__wrap">
      <span @click="play" class="pickle-rick-icon">
        <img
          alt="Pickle Rick"
          class="float-end"
          width="100"
          height="45"
          src="/images/pickle-rick.png"
        />
      </span>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import BaseNavbar from "@/components/BaseNavbar.vue";
import { computed, inject, ref, watch } from "vue";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import charactersQuery from "@/graphql/queries/characters.query.gql";
import characterQuery from "@/graphql/queries/character.query.gql";
import episodeQuery from "@/graphql/queries/episode.query.gql";
import CharactersTable from "@/components/CharactersTable.vue";
import type { Emitter } from "mitt";
import type { Events } from "@/types/EmitEvents";
import { useCharactersStore } from "@/stores/characters";
import { useToast } from "vue-toastification";
import type { FilterType } from "@/types/Characters";
import { useSound } from "@vueuse/sound";
import pickleRickSfx from "@/assets/sounds/pickle_rick.mp3";

const charactersStore = useCharactersStore();
const toast = useToast();
const emitter = inject("emitter") as Emitter<Events>;
const tabs = ["All Characters", "Favorites"];
const activeTabIndex = ref(0);
const currentPage = ref(1);
type Query = "charactersQuery" | "characterQuery" | "episodesQuery";
const currentQuery = ref<Query>("charactersQuery");
const searchValue = ref("");
let filterBy: FilterType = "Name";

const tableHeaders = [
  "Photo",
  "Character ID",
  "Name",
  "Gender",
  "Species",
  "Last Episode",
  "Add to Favorites",
];

const { result, loading, onError, refetch } = useQuery(charactersQuery, {
  page: currentPage.value,
  filter: { name: "" },
});

const {
  load: episodeLoad,
  result: episodeResult,
  loading: episodeLoading,
  onError: episodeOnError,
} = useLazyQuery(episodeQuery);

const {
  load: characterLoad,
  result: characterResult,
  loading: characterLoading,
  onError: characterOnError,
} = useLazyQuery(characterQuery);

onError((error) => {
  toast.error(error.message ?? "Unexpected error occured");
});
episodeOnError((error) => {
  toast.error(error.message ?? "Unexpected error occured");
});
characterOnError((error) => {
  toast.error(error.message ?? "Unexpected error occured");
});

watch(currentPage, (value) => {
  refetch({ page: value });
  episodeLoad();
});
const tableData = computed(() => {
  //All characters data
  if (activeTabIndex.value === 0) {
    if (currentQuery.value === "charactersQuery")
      return result.value?.characters?.results;
    else if (currentQuery.value === "episodesQuery" && episodeResult.value)
      return episodeResult?.value?.episodes?.results[0]?.characters;
    else if (characterResult.value?.character)
      return [characterResult.value.character];
    // Favorites Data
  } else {
    if (!searchValue.value?.trim()) return charactersStore.getCharacters;
    if (currentQuery.value === "charactersQuery")
      return charactersStore.filterBy("name", searchValue.value);
    if (currentQuery.value === "characterQuery")
      return charactersStore.filterBy("id", searchValue.value);
    else return charactersStore.filterBy("episode", searchValue.value);
  }
  return "";
});

const totalPages = computed(() => {
  if (currentQuery.value === "charactersQuery" && activeTabIndex.value === 0)
    return result.value.characters.info.pages;
  else return 1;
});

function search(value: string): void {
  currentPage.value = 1;
  searchValue.value = value;
  switch (filterBy) {
    case "Name":
      refetch({ page: currentPage.value, filter: { name: value } });
      currentQuery.value = "charactersQuery";
      break;
    case "Episode":
      episodeLoad(undefined, {
        page: currentPage.value,
        episode: value,
      });
      currentQuery.value = "episodesQuery";
      break;
    case "Identifier":
      characterLoad(undefined, { id: value.toString() });
      currentQuery.value = "characterQuery";
      break;
  }
}
function reset(): void {
  filterBy = "Name";
  searchValue.value = "";
  activeTabIndex.value = 0;
  currentQuery.value = "charactersQuery";
  currentPage.value = 1;
  emitter.emit("resetSearchBar");
  refetch({ page: currentPage.value, filter: { name: "" } });
}

emitter.on("search", search);
emitter.on("logoClicked", reset);
emitter.on("changeSelect", (value) => {
  filterBy = value;
});
emitter.on("addToFavorites", (characterToAdd): void => {
  charactersStore.addCharacter(characterToAdd);
});
emitter.on("removeFromFavorites", (characterToRemove): void => {
  charactersStore.removeCharacter(characterToRemove.id);
});

const { play } = useSound(pickleRickSfx);
</script>
