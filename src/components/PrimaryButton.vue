<script setup lang="ts">
defineProps<{
  text: string;
  type?: "submit" | "reset" | "button";
}>();
</script>

<template>
  <button class="uk-button uk-button-primary" :type="type">
    {{ text }}
  </button>
</template>

<style scoped></style>
