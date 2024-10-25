<template>
  <div ref="formRef" class="base-search-bar">
    <v-row :no-gutters="true" class="justify-center">
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
          @keydown.esc="searchValue = ''"
          ref="searchInputRef"
          name="search"
          :label="searchLabel"
          class="base-search-bar__input"
          append-inner-icon="mdi-magnify"
          density="comfortable"
          variant="outlined"
          single-line
          clearable
        ></v-text-field>
        <span class="error-msg">{{ errorMessage }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { onKeyStroke, useDebounceFn } from "@vueuse/core";
import { useField } from "vee-validate";
import type { Emitter } from "mitt";
import type { Events } from "@/types/EmitEvents";
import type { FilterType } from "@/types/Characters";
import { useBreakpoints } from "@/composables/useBreakpoints";

const emitter = inject("emitter") as Emitter<Events>;
const searchInputRef = ref();

function validateSearch(value: any) {
  if (!value?.trim()) {
    return "Type something to search";
  }
  if (
    selectedItem.value === "Identifier" &&
    value &&
    !Number.isInteger(+value?.trim())
  )
    return "Invalid ID";
  if (
    selectedItem.value === "Episode" &&
    !value?.trim()?.match(/(S\d{2}E\d{2})/gim)
  )
    return "Invalid episode";
  return true;
}

const {
  errorMessage,
  value: searchValue,
  validate,
  resetField,
} = useField<string>('search', validateSearch, { initialValue: "" });

onKeyStroke("/", (e): void => {
  const searchInput: HTMLInputElement =
    searchInputRef.value.$el.querySelector("input");
  searchInput.focus();
  if (!searchInputRef.value.active) e.preventDefault();
});

onKeyStroke("Enter", search);

async function search(): Promise<void> {
  const validationResult = await validate();
  if (validationResult.valid) emitter.emit("search", <string>searchValue.value);
}

const debouncedSearch = useDebounceFn(search, 500);

watch(searchValue, (value): void => {
  if (value) debouncedSearch();
});

const selectedItem = ref<FilterType>("Name");
const selectItems = ref(["Name", "Identifier", "Episode"]);

watch(selectedItem, (value) => {
  resetField();
  emitter.emit("changeSelect", value);
});

const { isMobile } = useBreakpoints();
const searchLabel = computed(() => (isMobile.value ? "Press /" : ""));

emitter.on("resetSearchBar", () => {
  selectedItem.value = "Name";
  resetField();
});
</script>

<style scoped></style>
