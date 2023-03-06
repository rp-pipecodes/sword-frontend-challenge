<script setup lang="ts">
import { useDiscoveryStore } from "@/stores/discovery";
import { computed } from "vue";
import TopicButton from "./TopicButton.vue";

const discoveryStore = useDiscoveryStore();

const topics = computed(() => discoveryStore.topics);
</script>

<template>
  <div class="topics">
    <label class="topics-title">{{ $t("topics.title") }}</label>

    <div class="topics-list uk-margin-small-top">
      <TopicButton
        class="topic-button"
        v-for="topic in topics"
        :topic="topic"
        :key="topic.key"
      />
    </div>
  </div>
</template>

<style scoped>
.topics {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.topics-title {
  font-weight: 600;
}

.topics-list {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.topics-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.topics-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.topic-button {
  margin-right: 8px;
}

.topic-button:last-child {
  margin-right: 0px;
}
</style>
