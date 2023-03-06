import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import i18n from "@/i18n";
import AUTH_MOCK from "./mocks/auth.mock.json";
import TOPIC_MOCK from "./mocks/topic.mock.json";
import TOPICS_RESPONSE_MOCK from "./mocks/topics-response.mock.json";
import TopicTitle from "../TopicTitle.vue";
import { useDiscoveryStore } from "@/stores/discovery";
import { SORT_OPTIONS } from "@/constants/topics";

describe("TopicTitle.vue Test", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(TopicTitle, {
      propsData: {
        topic: TOPIC_MOCK,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          i18n,
        ],
      },
    });

    const title = wrapper.find("h1");
    expect(title.text()).toBe(
      `${i18n.global.t("topics.top_title", {
        topic_name: TOPIC_MOCK.displayName,
      })}`
    );

    // dropdown
    expect(wrapper.find("ul").exists()).toBeTruthy();
  });

  it("updates the topic sort option", async () => {
    server.use(
      rest.post(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/topics.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(TOPICS_RESPONSE_MOCK));
        }
      ),
      rest.get(
        `https://api.github.com/search/repositories`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      )
    );

    const wrapper = shallowMount(TopicTitle, {
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
          i18n,
        ],
      },
    });

    const discoveryStore = useDiscoveryStore();

    const title = wrapper.find("h1");
    await title.trigger("click");

    const sortOptions = wrapper.findAll(".sort-item");
    expect(sortOptions.length).toBe(SORT_OPTIONS.length);

    await sortOptions[1].trigger("click");

    expect(discoveryStore.updateTopic).toHaveBeenCalledOnce();
  });
});
