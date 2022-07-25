<template>
  <v-row>
    <v-col cols="12" md="3" class="d-flex justify-center">
      <img
        @click="handleLogoClick"
        class="base-header__logo"
        width="248"
        src="/images/logo.png"
        alt="Logo"
      />
    </v-col>
    <v-col cols="12" md="9">
      <CharactersSearchBar class="mt-2"></CharactersSearchBar>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CharactersSearchBar from "@/components/CharactersSearchBar.vue";
import { inject } from "vue";
import type { Emitter } from "mitt";
import type { Events } from "@/types/EmitEvents";

const emitter = inject("emitter") as Emitter<Events>;
function handleLogoClick() {
  emitter.emit("logoClicked");
}
</script>
