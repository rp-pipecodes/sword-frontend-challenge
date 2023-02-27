import type { Topic } from "@/models/topic";
import type { SortOption } from "@/models/sortOption";

export const TOPICS_DEFAULT: Topic[] = [
  {
    key: "vue",
    displayName: "Vue",
    selected: false,
    sort: "stars",
  },
  {
    key: "typescript",
    displayName: "Typescript",
    selected: false,
    sort: "stars",
  },
  {
    key: "javascript",
    displayName: "Javascript",
    selected: false,
    sort: "stars",
  },
  {
    key: "go",
    displayName: "Go",
    selected: false,
    sort: "stars",
  },
  {
    key: "css",
    displayName: "CSS",
    selected: false,
    sort: "stars",
  },
  {
    key: "node",
    displayName: "Node",
    selected: false,
    sort: "stars",
  },
];

export const SORT_OPTIONS: SortOption[] = [
  {
    key: "starts",
    displayName: "Sort by stars",
  },
  {
    key: "forks",
    displayName: "Sort by forks",
  },
  {
    key: "help-wanted-issues",
    displayName: "Sort by help wanted issues",
  },
  {
    key: "updated",
    displayName: "Sort by updated",
  },
];
