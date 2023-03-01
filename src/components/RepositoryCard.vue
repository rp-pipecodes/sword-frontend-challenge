<script setup lang="ts">
import type { Repository } from "@/models/repository";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed } from "vue";
import { useToast } from "vue-toast-notification";
import { TOAST_OPTIONS } from "@/constants/toasts";

const props = defineProps<{
  repository: Repository;
}>();

const discoveryStore = useDiscoveryStore();

const $toast = useToast();

const repository = computed(() => props.repository);

const bookmark = computed(() =>
  discoveryStore.bookmarks.find(
    (bookmark) => bookmark.repoId === repository.value.repoId
  )
);

const imageUrl = computed(
  () => `https://opengraph.githubassets.com/123abc/${repository.value.fullName}`
);

function handleClick() {
  window.open(repository.value.url, "_blank");
}

function handleToggleBookmark() {
  if (bookmark.value) {
    discoveryStore.removeBookmark(bookmark.value).catch((error) => {
      $toast.error(error, TOAST_OPTIONS);
    });
  } else {
    discoveryStore.addBookmark(repository.value).catch((error) => {
      $toast.error(error, TOAST_OPTIONS);
    });
  }
}
</script>

<template>
  <div class="repository-card">
    <img :src="imageUrl" alt="repository image" uk-cover @click="handleClick" />

    <span
      class="star-button"
      :uk-icon="bookmark ? 'icon: minus-circle;' : 'icon: plus-circle;'"
      @click="handleToggleBookmark"
    >
    </span>
  </div>
</template>

<style scoped>
.repository-card {
  cursor: pointer;
}

.repository-card:after {
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

.repository-card:hover:after {
  opacity: 1;
}

.star-button {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.repository-card:hover > .star-button {
  display: block;
}
</style>
