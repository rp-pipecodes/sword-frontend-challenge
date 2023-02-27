<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <button class="uk-button uk-button-primary">
    {{ text }}
  </button>
</template>

<style scoped></style>
