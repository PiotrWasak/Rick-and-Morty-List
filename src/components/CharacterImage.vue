<template>
  <img
    :class="{ 'base-table__image--grayscale': isDead }"
    v-bind="$attrs"
    width="48"
    height="68"
    :src="src"
    alt="Character image"
  />
  <span v-if="isDead" class="base-table__img-ribbon">
    <v-img height="32" width="32" src="/images/ribbon.png"></v-img>
  </span>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  isDead?: boolean;
}

defineProps<Props>();
</script>
