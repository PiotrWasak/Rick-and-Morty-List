<template>
  <div class="text-center">
    <v-pagination
      :value="modelValue"
      @click="$emit('update:modelValue', 20)"
      :length="length"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
  length: number;
}

interface Emits {
  "update:modelValue": number;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
