<script setup lang="ts">
import { TOAST_OPTIONS } from "@/constants/toasts";
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

function handleToggleTopic() {
  const newTopic: Topic = {
    ...topic.value,
    selected: !topic.value.selected,
  };

  discoveryStore.updateTopic(newTopic).catch((error) => {
    $toast.error(error, TOAST_OPTIONS);
  });
}
</script>

<template>
  <div
    class="topic-button"
    :class="topic.selected ? 'selected' : ''"
    @click="handleToggleTopic"
  >
    {{ topic.displayName }}
  </div>
</template>

<style scoped>
.topic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 30px;
  background-color: #fff;
  border: 1px solid grey;
  cursor: pointer;
  border-radius: 9999px;
  font-weight: 600;
}

.selected {
  background-color: lightgrey;
}
</style>
