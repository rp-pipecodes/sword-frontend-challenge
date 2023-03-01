<script setup lang="ts">
import { useDiscoveryStore } from "@/stores/discovery";
import { computed, onMounted } from "vue";
import RepositoryBookmark from "./RepositoryBookmark.vue";

const discoveryStore = useDiscoveryStore();

const bookmarks = computed(() => discoveryStore.bookmarks);

onMounted(() => {
  discoveryStore.getBookmarks();
});
</script>

<template>
  <div v-show="bookmarks.length > 0" class="my-bookmarks">
    <h1 class="uk-heading-small">My Bookmarks</h1>

    <div class="bookmarks-list uk-margin-small-top">
      <RepositoryBookmark
        class="bookmark-item"
        v-for="repository in bookmarks"
        :repository="repository"
        :key="repository.id"
      />
    </div>
  </div>
</template>

<style scoped>
.my-bookmarks {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bookmarks-list {
  overflow-x: scroll;
  width: 100%;
  display: flex;
  flex-direction: row;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.bookmarks-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.bookmarks-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.bookmark-item {
  margin-right: 8px;
  min-width: 200px;
  height: 100px;
}

.bookmark-item:last-child {
  margin-right: 0px;
}
</style>
