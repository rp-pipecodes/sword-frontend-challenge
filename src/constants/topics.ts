import type { Topic } from "@/models/topic";
import type { SortOption } from "@/models/sortOption";
import $i18n from "@/i18n";

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
    displayName: $i18n.global.t("sort_options.stars"),
  },
  {
    key: "forks",
    displayName: $i18n.global.t("sort_options.forks"),
  },
  {
    key: "help-wanted-issues",
    displayName: $i18n.global.t("sort_options.help_wanted_issues"),
  },
  {
    key: "updated",
    displayName: $i18n.global.t("sort_options.updated"),
  },
];
