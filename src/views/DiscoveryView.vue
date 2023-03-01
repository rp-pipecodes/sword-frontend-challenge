<script setup lang="ts">
import MyBookmarks from "@/components/MyBookmarks.vue";
import RepositoryListing from "@/components/RepositoryListing.vue";
import ToggleTopics from "@/components/ToggleTopics.vue";
import { TOAST_OPTIONS } from "@/constants/toasts";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed, onMounted } from "vue";
import { useToast } from "vue-toast-notification";

const discoveryStore = useDiscoveryStore();

const topics = computed(() => discoveryStore.topics);

const $toast = useToast();

onMounted(() => {
  discoveryStore.getTopics().catch((error) => {
    $toast.error(error, TOAST_OPTIONS);
  });
});
</script>

<template>
  <main class="discovery">
    <MyBookmarks class="uk-margin-medium-bottom" />

    <ToggleTopics />

    <RepositoryListing
      class="uk-margin-medium-top"
      v-for="topic in topics.filter((temp) => temp.selected)"
      :topic="topic"
      :key="topic.key"
    />
  </main>
</template>
