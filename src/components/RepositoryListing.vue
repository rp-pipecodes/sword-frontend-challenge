<script setup lang="ts">
import { computed } from "vue";
import RepositoryCard from "./RepositoryCard.vue";
import type { Topic } from "@/models/topic";
import TopicTitle from "./TopicTitle.vue";

const props = defineProps<{
  topic: Topic;
}>();

const topic = computed(() => props.topic);
</script>

<template>
  <div
    v-if="topic.repositories && topic.repositories?.length > 0"
    class="repository-listing"
  >
    <TopicTitle :topic="topic" />
    <div class="repositories-list uk-margin-small-top">
      <RepositoryCard
        class="repository-item"
        v-for="repository in topic.repositories"
        :repository="repository"
        :key="repository.id"
      />
    </div>
  </div>
</template>

<style scoped>
.repository-listing {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.repositories-list {
  width: 100%;
  flex-direction: row;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 30px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.repositories-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.repositories-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.repository-item {
  flex: 0 0 auto;
  margin-right: 8px;
  min-width: 260px;
  height: 130px;
}

.repository-item:last-child {
  margin-right: 0px;
}
</style>
