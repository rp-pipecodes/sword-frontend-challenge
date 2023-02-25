<script setup lang="ts">
defineProps<{
  text: string;
  classes?: string;
}>();
</script>

<template>
  <button class="uk-button uk-button-primary" :class="classes">
    {{ text }}
  </button>
</template>

<style scoped></style>
