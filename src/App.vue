<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import NavBar from "./components/NavBar.vue";

const authStore = useAuthStore();
</script>

<template>
  <header v-if="authStore.user">
    <NavBar />
  </header>

  <RouterView />
</template>
