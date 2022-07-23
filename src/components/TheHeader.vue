<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-img
        style="filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
        width="240"
        height="70"
        src="src/assets/images/logo.png"
      ></v-img>
    </v-col>
    <v-col cols="12" md="9">
      <BaseSearchBar class="mt-2"></BaseSearchBar>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import BaseSearchBar from "@/components/BaseSearchBar.vue";
</script>

<style scoped></style>
