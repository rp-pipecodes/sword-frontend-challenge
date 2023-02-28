import { useAuthStore } from "./auth";
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { TOPICS_DEFAULT } from "@/constants/topics";
import type { Repository } from "@/models/repository";
import type { Topic } from "@/models/topic";

const REPOSITORIES_PER_PAGE = "10";

export const useDiscoveryStore = defineStore("discovery", () => {
  const bookmarks: Ref<Repository[]> = ref([]);
  const topics: Ref<Topic[]> = ref(TOPICS_DEFAULT);
  const topicsId: Ref<string | null> = ref(null);

  const authStore = useAuthStore();

  function getBookmarks() {
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

    const response = await fetch(
      `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics.json`
    );

    const data = await response.json();

    if (data) {
      topicsId.value = Object.keys(data)[0] as string;

      const tempTopics = Object.values(data)[0] as Topic[];

      for (const topic of tempTopics) {
        if (topic.selected) {
          const repos = await getRepositories(topic);
          topic.repositories = repos;
        }
      }

      topics.value = tempTopics;
    }
  }

  async function updateTopic(topic: Topic) {
    const newTopic = Object.assign({}, topic);

    if (topic.selected) {
      const repos = await getRepositories(topic);
      newTopic.repositories = repos;
    }

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
        }.json`,
        {
          method: "DELETE",
        }
      );
    }

    // clear repositories before update the database because we don't need to store them in the database
    const topicsWithoutRepositories: Topic[] = updatedTopics.map((temp) => {
      return {
        ...temp,
        repositories: undefined,
      };
    });

    fetch(
      `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics.json`,
      {
        method: "POST",
        body: JSON.stringify(topicsWithoutRepositories),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        topicsId.value = data.name;

        topics.value = updatedTopics;
      });
  }

  function getRepositories(topic: Topic): Promise<Repository[]> {
    return new Promise((resolve, reject) => {
      const paramsString = `q=${topic.key}&sort=${topic.sort}&per_page=${REPOSITORIES_PER_PAGE}&page=1`;

      fetch(`https://api.github.com/search/repositories?${paramsString}`)
        .then((response) => response.json())
        .then((data) => {
          const repositories: Repository[] =
            data?.items?.map((item: any) => {
              return {
                id: item.id,
                url: item.html_url,
                fullName: item.full_name,
              };
            }) || null;
          return resolve(repositories);
        })
        .catch((error) => reject(error));
    });
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
