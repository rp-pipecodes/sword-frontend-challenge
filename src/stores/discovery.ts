import $i18n from "@/i18n";
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

  async function getBookmarks() {
    try {
      const user = authStore.user;

      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          user?.uid
        }/bookmarks.json`
      );

      if (response.status === 200) {
        const data = await response.json();

        if (data) {
          const keys = Object.keys(data);
          const temp: Repository[] = [];

          keys.forEach((key) => {
            temp.push({
              ...data[key],
              id: key,
            });
          });

          bookmarks.value = temp;
        } else {
          bookmarks.value = [];
        }

        return Promise.resolve(bookmarks.value);
      } else {
        return Promise.reject(
          $i18n.global.t("bookmarks.errors.fetch_bookmarks")
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function getTopics() {
    try {
      const user = authStore.user;

      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics.json`
      );

      if (response.status === 200) {
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
        } else {
          topics.value = TOPICS_DEFAULT;
        }

        return Promise.resolve(topics.value);
      } else {
        return Promise.reject($i18n.global.t("topics.errors.fetch_topics"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function updateTopic(topic: Topic) {
    const newTopic = Object.assign({}, topic);

    if (topic.selected) {
      try {
        const repos = await getRepositories(topic);
        newTopic.repositories = repos;
      } catch (error) {
        return Promise.reject(error);
      }
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
      // FIXME: I tried to update the entire object without recreating it but without success
      try {
        await fetch(
          `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/topics/${
            topicsId.value
          }.json`,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        return Promise.reject(error);
      }
    }

    // clear repositories before update the database because we don't need to store them in the database
    const topicsWithoutRepositories: Topic[] = updatedTopics.map((temp) => {
      return {
        ...temp,
        repositories: undefined,
      };
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          user?.uid
        }/topics.json`,
        {
          method: "POST",
          body: JSON.stringify(topicsWithoutRepositories),
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        topicsId.value = data.name;

        topics.value = updatedTopics;

        return Promise.resolve(topics.value);
      } else {
        return Promise.reject($i18n.global.t("topics.errors.update_topic"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function getRepositories(topic: Topic): Promise<Repository[]> {
    return new Promise((resolve, reject) => {
      const paramsString = `q=${topic.key}&sort=${topic.sort}&per_page=${REPOSITORIES_PER_PAGE}&page=1`;

      fetch(`https://api.github.com/search/repositories?${paramsString}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }

          return reject($i18n.global.t("discovery.errors.fetch_repos"));
        })
        .then((data) => {
          const repositories: Repository[] =
            data?.items?.map((item: any) => {
              return {
                repoId: item.id,
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
    try {
      const user = authStore.user;

      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${user?.uid}/bookmarks/${
          repository.id
        }.json`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        await getBookmarks();

        return Promise.resolve();
      } else {
        return Promise.reject(
          $i18n.global.t("bookmarks.errors.remove_bookmark")
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function addBookmark(repository: Repository) {
    try {
      const user = authStore.user;

      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          user?.uid
        }/bookmarks.json`,
        {
          method: "POST",
          body: JSON.stringify(repository),
        }
      );

      if (response.status === 200) {
        await getBookmarks();

        return Promise.resolve();
      } else {
        return Promise.reject($i18n.global.t("bookmarks.errors.add_bookmark"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
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
