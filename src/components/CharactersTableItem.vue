<template>
  <tr class="base-table__row">
    <td>
      <CharacterImage
        class="float-end"
        :src="item.image"
        :isDead="item.status === 'Dead'"
      ></CharacterImage>
    </td>
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>
      <span>
        <v-icon :icon="genderIcons[item.gender]"></v-icon>
        {{ capitalize(item.gender) }}
      </span>
    </td>
    <td>{{ capitalize(item.species) }}</td>
    <td>{{ item.episode[item.episode.length - 1].episode }}</td>
    <td>
      <v-icon
        @click="toggleFavorite"
        size="large"
        class="base-table__icon"
        :class="{ 'base-table__icon--active': isInFavorites }"
        icon="mdi-star"
      ></v-icon>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { capitalize, computed, inject } from "vue";
import CharacterImage from "@/components/CharacterImage.vue";
import type { Emitter } from "mitt";
import type { Events } from "@/types/EmitEvents";
import type { Result } from "@/types/Characters";
import { useCharactersStore } from "@/stores/characters";

interface Props {
  item: Result;
}

const genderIcons = {
  Male: "mdi-gender-male",
  Female: "mdi-gender-female",
  Genderless: "mdi-close",
  unknown: "mdi-minus",
};

const props = defineProps<Props>();
const emitter = inject("emitter") as Emitter<Events>;

const charactersStore = useCharactersStore();
const isInFavorites = computed(() => {
  return charactersStore.getCharacters.find(
    (character) => character.id === props.item.id
  );
});

function toggleFavorite() {
  console.log({isInFavorites})
  if (!isInFavorites.value) emitter.emit("addToFavorites", props.item);
  else emitter.emit("removeFromFavorites", props.item);
}
</script>

<style scoped></style>
