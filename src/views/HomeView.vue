<template>
  <v-container>
    <TheHeader></TheHeader>
    <v-divider></v-divider>
    <BaseNavbar class="mt-5" :tabs="tabs" v-model="activeTabIndex"></BaseNavbar>
    <div class="loading" v-if="loading || episodeLoading">
      <span>Loading...</span>
      <img src="/src/assets/images/spinner.svg" alt="loading" />
    </div>
    <div v-else>
      <CharactersTable
        v-if="tableData"
        class="mt-5"
        :headers="tableHeaders"
        :items="tableData"
      ></CharactersTable>
      <div class="w-25">
        <v-pagination
          class="mt-5"
          v-if="totalPages > 1"
          next-icon="mdi-play"
          prev-icon="mdi-play mdi-rotate-180"
          v-model="currentPage"
          :length="totalPages"
        ></v-pagination>
      </div>
    </div>
  </v-container>
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
import type { FilterType, Result } from "@/types/Characters";

const charactersStore = useCharactersStore();
const toast = useToast();
const emitter = inject("emitter") as Emitter<Events>;
const tabs = ["All Characters", "Favorites"];
const activeTabIndex = ref(0);
const currentPage = ref(1);
type Query = "charactersQuery" | "characterQuery" | "episodesQuery";
const currentQuery = ref<Query>("charactersQuery");
let filterBy: FilterType = "Name";

const { result, loading, onError, refetch } = useQuery(charactersQuery, {
  page: currentPage.value,
});

const {
  load: episodeLoad,
  result: episodeResult,
  loading: episodeLoading,
  onError: episodeOnError,
  onResult,
  refetch: episodeRefetch,
} = useLazyQuery(episodeQuery);

onResult((queryResult) => {
  console.log("on result");
  console.log(queryResult);
});

const {
  load: characterLoad,
  result: characterResult,
  loading: characterLoading,
  onError: characterOnError,
  refetch: characterRefetch,
} = useLazyQuery(characterQuery);

onError((error) => {
  toast.error(error.message);
});

watch(currentPage, (value) => {
  refetch({ page: value });
  episodeLoad();
  console.log(episodeResult);
});

const tableData = computed(() => {
  if (activeTabIndex.value === 0) {
    if (currentQuery.value === "charactersQuery")
      return result.value?.characters?.results;
    else if (currentQuery.value === "episodesQuery" && episodeResult.value)
      return episodeResult?.value?.episodes?.results[0].characters;
    else if (characterResult.value?.character)
      return [characterResult.value.character];
  } else return charactersStore.getCharacters;
});

const totalPages = computed(() => {
  if (currentQuery.value === "charactersQuery")
    return result.value.characters.info.pages;
  else return 1;
});

const tableHeaders = [
  "Photo",
  "Character ID",
  "Name",
  "Gender",
  "Species",
  "Last Episode",
  "Add to Favorites",
];
emitter.on("addToFavorites", (characterToAdd): void => {
  charactersStore.addCharacter(characterToAdd as unknown as Result);
});

emitter.on("removeFromFavorites", (characterToRemove): void => {
  charactersStore.removeCharacter(characterToRemove.id);
});

function search(value: string) {
  currentPage.value = 1;
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
      characterLoad(undefined, { id: value });
      currentQuery.value = "characterQuery";
      break;
  }
}

emitter.on("search", search);

emitter.on("changeSelect", (value) => {
  filterBy = value;
});
</script>
