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
  <div class="uk-cover-container bookmark">
    <img :src="imageUrl" alt="repository image" uk-cover @click="handleClick" />
    <span
      class="star-button"
      uk-icon="icon: minus-circle"
      @click="handleRemoveBookmark"
    >
    </span>
  </div>
</template>

<style scoped>
.bookmark {
  cursor: pointer;
}

.bookmark:after {
  content: "\A";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
  pointer-events: none;
}

.bookmark:hover:after {
  opacity: 1;
}

.star-button {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.bookmark:hover > .star-button {
  display: block;
}
</style>
