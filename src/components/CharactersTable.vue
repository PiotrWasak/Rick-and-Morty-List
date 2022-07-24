<template>
  <div>
    <v-table class="base-table">
      <thead class="base-table__head">
        <tr>
          <th v-for="header in headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <CharactersTableItem
          v-for="item in items"
          :item="item"
          :key="item.id"
        ></CharactersTableItem>
      </tbody>
    </v-table>
    <div class="base-table__bottom-line"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import CharactersTableItem from "@/components/CharactersTableItem.vue";
import type { Characters } from "@/types/Characters";

interface Props {
  headers: string[];
  items: Characters;
}

defineProps<Props>();
</script>

<style scoped></style>
