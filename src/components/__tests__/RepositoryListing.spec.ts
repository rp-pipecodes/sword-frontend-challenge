import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import TOPIC_MOCK from "./mocks/topic.mock.json";
import RepositoryListing from "../RepositoryListing.vue";
import type { Topic } from "@/models/topic";

describe("RepositoryListing.vue Test", () => {
  it("not renders the component if no topic repositories available", () => {
    const topic: Topic = {
      ...TOPIC_MOCK,
      repositories: undefined,
    };

    const wrapper = shallowMount(RepositoryListing, {
      propsData: {
        topic: topic,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    expect(wrapper.findComponent({ name: "TopicTitle" }).exists()).toBeFalsy();
    expect(wrapper.findAllComponents({ name: "RepositoryCard" }).length).toBe(
      0
    );
  });

  it("renders the component with topic repositories available", () => {
    const wrapper = shallowMount(RepositoryListing, {
      propsData: {
        topic: TOPIC_MOCK,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    expect(wrapper.findComponent({ name: "TopicTitle" }).exists()).toBeTruthy();
    expect(
      wrapper.findAllComponents({ name: "RepositoryCard" }).length
    ).toBeGreaterThanOrEqual(1);
  });
});
