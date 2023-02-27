import { useAuthStore } from "./auth";
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { TOPICS_DEFAULT } from "@/constants/topics";
import type { Repository } from "@/models/repository";
import type { Topic } from "@/models/topic";

export const useDiscoveryStore = defineStore("discovery", () => {
  const bookmarks: Ref<Repository[]> = ref([]);
  const topics: Ref<Topic[]> = ref(TOPICS_DEFAULT);
  const topicsId: Ref<string | null> = ref(null);

  const authStore = useAuthStore();

  async function getBookmarks() {
    const user = authStore.user;

    fetch(
      `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
        user?.uid
      }/bookmarks.json`
    )
      .then((response) => response.json())
      .then((data: Repository[] | null) => {
        bookmarks.value = data || [];
      });
  }

  async function getTopics() {
    const user = authStore.user;

    fetch(
      `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics.json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          topicsId.value = Object.keys(data)[0] as string;
          topics.value = Object.values(data)[0] as Topic[];
        }
      });
  }

  async function updateTopic(topic: Topic) {
    // clear repositories before update the database because we don't need to store them in the database
    const newTopic: Topic = {
      ...topic,
      repositories: undefined,
    };

    const updatedTopics: Topic[] = topics.value.map((temp) => {
      if (temp.key === newTopic.key) {
        return newTopic;
      }

      return temp;
    });

    const user = authStore.user;

    if (topicsId.value) {
      // remove the old ones if exist to recreate the array with the new data
      // I tried to update the entire object without recreating it but without success
      await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics/${
          topicsId.value
        }/.json`,
        {
          method: "DELETE",
        }
      );
    }

    fetch(
      `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics.json`,
      {
        method: "POST",
        body: JSON.stringify(updatedTopics),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        topicsId.value = data.name;

        topics.value = updatedTopics;
      });

    // TODO: add/remove/update the listing
  }

  async function getRepositories(topic: Topic) {
    // TODO: fetch topic repositories
  }

  async function removeBookmark(repository: Repository) {
    // TODO: remove bookmark from the database and update the state
  }

  async function addBookmark(repository: Repository) {
    // TODO: add bookmark to the database and update the state
  }

  return {
    bookmarks,
    topics,
    getBookmarks,
    getTopics,
    updateTopic,
    getRepositories,
    removeBookmark,
    addBookmark,
  };
});
