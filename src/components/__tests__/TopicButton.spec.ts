import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import TOPIC_MOCK from "./mocks/topic.mock.json";
import TOPICS_RESPONSE_MOCK from "./mocks/topics-response.mock.json";
import TopicButton from "../TopicButton.vue";
import { useDiscoveryStore } from "@/stores/discovery";

describe("TopicButton.vue Test", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(TopicButton, {
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

    expect(wrapper.text()).toBe(TOPIC_MOCK.displayName);
  });

  it("toggles the button", async () => {
    server.use(
      rest.post(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/topics.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(TOPICS_RESPONSE_MOCK));
        }
      )
    );

    const wrapper = shallowMount(TopicButton, {
      propsData: {
        topic: TOPIC_MOCK,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: AUTH_MOCK.user,
              },
            },
          }),
        ],
      },
    });

    await wrapper.trigger("click");

    const discoveryStore = useDiscoveryStore();

    expect(discoveryStore.updateTopic).toHaveBeenCalledOnce();
  });
});
