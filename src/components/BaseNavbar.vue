<template>
  <nav class="base-navbar">
    <ul class="base-navbar__list">
      <li
        :class="{
          'base-navbar__list-item': true,
          'base-navbar__list-item--active': index === modelValue,
          'ms-4': true,
        }"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="switchTab(index)"
      >
        {{ tab }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  tabs: string[];
  modelValue: number;
}

interface Emits {
  (event: "update:modelValue", value: number): void;
}

defineProps<Props>();
const emits = defineEmits<Emits>();

function switchTab(index: number) {
  emits("update:modelValue", index);
}
</script>

<style scoped></style>
