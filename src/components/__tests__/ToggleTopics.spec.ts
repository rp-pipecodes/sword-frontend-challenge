import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import i18n from "@/i18n";
import TOPICS_MOCK from "./mocks/topics.mock.json";
import ToggleTopics from "../ToggleTopics.vue";

describe("ToggleTopics.vue Test", () => {
  it("renders the component with topics", () => {
    const wrapper = shallowMount(ToggleTopics, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              discovery: {
                topics: TOPICS_MOCK,
              },
            },
          }),
          i18n,
        ],
      },
    });

    const title = wrapper.find("label");
    expect(title.exists()).toBeTruthy();
    expect(title.text()).toBe(i18n.global.t("topics.title"));
    expect(wrapper.findAllComponents({ name: "TopicButton" }).length).toBe(
      TOPICS_MOCK.length
    );
  });
});
