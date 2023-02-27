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

function handleRemoveBookmark() {
  discoveryStore.removeBookmark(repository.value);
}
</script>

<template>
  <div class="uk-cover-container bookmark" @click="handleClick">
    <img
      width="120"
      height="60"
      :src="imageUrl"
      alt="repository image"
      uk-cover
    />
    <span
      class="star-button"
      uk-icon="icon: star"
      @click="handleRemoveBookmark"
    >
    </span>
  </div>
</template>

<style scoped>
.bookmark {
  cursor: pointer;
}

.star-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
