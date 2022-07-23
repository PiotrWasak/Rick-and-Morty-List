<template>
  <div class="base-search-bar">
    <v-row no-gutters>
      <v-col cols="8" md="2">
        <div class="base-search-bar__label">Search by</div>
      </v-col>
      <v-col cols="8" md="3">
        <v-select
          class="base-search-bar__select"
          :items="selectItems"
          v-model="selectedItem"
          variant="outlined"
          density="comfortable"
        ></v-select>
      </v-col>
      <v-col cols="8" md="5">
        <v-text-field
          v-model="searchValue"
          ref="searchInputRef"
          label="Press /"
          class="base-search-bar__input"
          append-inner-icon="mdi-magnify"
          density="comfortable"
          variant="outlined"
          single-line
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { onKeyStroke } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import type { Emitter } from "mitt";
import type { Events } from "@/types/EmitEvents";
import type { FilterType } from "@/types/Characters";

const emitter = inject("emitter") as Emitter<Events>;

const searchInputRef = ref();
const searchValue = ref<string>("");

onKeyStroke("/", (e) => {
  const searchInput: HTMLInputElement =
    searchInputRef.value.$el.querySelector("input");
  searchInput.focus();
  if (!searchInputRef.value.active) e.preventDefault();
});

onKeyStroke("Enter", search);

function search() {
  console.log("emit");
  emitter.emit("search", searchValue.value);
}

const debouncedSearch = useDebounceFn(search, 1000);

watch(searchValue, () => {
  debouncedSearch();
});

const selectedItem = ref<FilterType>("Name");
const selectItems = ref(["Name", "Identifier", "Episode"]);

watch(selectedItem, (value) => {
  emitter.emit("changeSelect", value);
});
</script>

<style scoped></style>
