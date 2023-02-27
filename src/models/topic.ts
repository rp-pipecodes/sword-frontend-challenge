import type { Repository } from "./repository";

export interface Topic {
  key: string;
  displayName: string;
  selected: boolean;
  sort: string;
  repositories?: Repository[];
}
