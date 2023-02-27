<script setup lang="ts">
import { SORT_OPTIONS } from "@/constants/topics";
import type { Topic } from "@/models/topic";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed } from "vue";

const props = defineProps<{
  topic: Topic;
}>();

const topic = computed(() => props.topic);

const discoveryStore = useDiscoveryStore();

function handleUpdateTopicSort(sort: string) {
  const newTopic: Topic = {
    ...topic.value,
    sort: sort,
  };

  discoveryStore.updateTopic(newTopic);
}
</script>

<template>
  <nav uk-dropnav="mode: click">
    <ul class="uk-subnav">
      <li>
        <h1 class="uk-heading-small">
          Top {{ topic.displayName }} <span uk-drop-parent-icon></span>
        </h1>
        <div class="uk-dropdown">
          <ul class="uk-nav uk-dropdown-nav">
            <li
              v-for="sortOption in SORT_OPTIONS"
              :class="topic.sort === sortOption.key ? 'uk-active' : ''"
              :key="sortOption.key"
            >
              <span @click="() => handleUpdateTopicSort(sortOption.key)">{{
                sortOption.displayName
              }}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
