<script setup lang="ts">
import type { Repository } from "@/models/repository";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed } from "vue";

const props = defineProps<{
  repository: Repository;
}>();

const repository = computed(() => props.repository);

const imageUrl = computed(
  () => `https://opengraph.githubassets.com/123abc/${repository.value.fullName}`
);

const discoveryStore = useDiscoveryStore();

function handleClick() {
  window.open(repository.value.url, "_blank");
}

function handleToggleBookmark() {}
</script>

<template>
  <div class="uk-cover-container repository-card" @click="handleClick">
    <img
      width="200"
      height="100"
      :src="imageUrl"
      alt="repository image"
      uk-cover
    />
    <span
      class="star-button"
      uk-icon="icon: star"
      @click="handleToggleBookmark"
    >
    </span>
  </div>
</template>

<style scoped>
.repository-card {
  cursor: pointer;
}

.repository-card:hover {
  /* TODO: magnifier */
}

.star-button {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
