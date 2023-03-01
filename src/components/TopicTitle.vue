<script setup lang="ts">
import { TOAST_OPTIONS } from "@/constants/toasts";
import { SORT_OPTIONS } from "@/constants/topics";
import type { Topic } from "@/models/topic";
import { useDiscoveryStore } from "@/stores/discovery";
import { computed } from "vue";
import { useToast } from "vue-toast-notification";

const props = defineProps<{
  topic: Topic;
}>();

const topic = computed(() => props.topic);

const discoveryStore = useDiscoveryStore();

const $toast = useToast();

function handleUpdateTopicSort(sort: string) {
  const newTopic: Topic = {
    ...topic.value,
    sort: sort,
  };

  discoveryStore.updateTopic(newTopic).catch((error) => {
    $toast.error(error, TOAST_OPTIONS);
  });
}
</script>

<template>
  <nav uk-dropnav="mode: click">
    <ul class="uk-subnav">
      <li>
        <h1 class="uk-heading-small title">
          Top {{ topic.displayName }} <span uk-drop-parent-icon></span>
        </h1>
        <div class="uk-dropdown">
          <ul class="uk-nav uk-dropdown-nav">
            <li
              v-for="sortOption in SORT_OPTIONS"
              :class="topic.sort === sortOption.key ? 'uk-active' : ''"
              :key="sortOption.key"
            >
              <span
                @click="() => handleUpdateTopicSort(sortOption.key)"
                class="sort-item"
                >{{ sortOption.displayName }}</span
              >
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.title {
  color: #333;
  font-size: 2.6rem;
  text-transform: none;
  cursor: pointer;
  margin-bottom: 0;
}

.sort-item {
  cursor: pointer;
}

@media (min-width: 960px) {
  .title {
    font-size: 3.25rem;
  }
}
</style>
