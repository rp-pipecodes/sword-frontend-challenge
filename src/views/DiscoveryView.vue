<script setup lang="ts">
import MyBookmarks from "@/components/MyBookmarks.vue";
import RepositoryListing from "@/components/RepositoryListing.vue";
import ToggleTopics from "@/components/ToggleTopics.vue";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed, onMounted } from "vue";

const discoveryStore = useDiscoveryStore();

const topics = computed(() => discoveryStore.topics);

onMounted(() => {
  discoveryStore.getTopics();
});
</script>

<template>
  <main class="discovery">
    <MyBookmarks />

    <ToggleTopics />

    <RepositoryListing
      class="uk-margin-medium-top"
      v-for="topic in topics.filter((temp) => temp.selected)"
      :topic="topic"
      :key="topic.key"
    />
  </main>
</template>
