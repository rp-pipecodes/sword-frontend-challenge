import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import TOPICS_RESPONSE_MOCK from "./mocks/topics-response.mock.json";
import { useDiscoveryStore } from "@/stores/discovery";
import DiscoveryView from "@/views/DiscoveryView.vue";

describe("DiscoveryView.vue Test", () => {
  it("renders the component", async () => {
    server.use(
      // Model any response overrides you need.
      rest.get(
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

    const wrapper = shallowMount(DiscoveryView, {
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

    await flushPromises();

    const discoveryStore = useDiscoveryStore();

    expect(discoveryStore.getTopics).toHaveBeenCalledOnce();

    expect(
      wrapper.findComponent({ name: "MyBookmarks" }).exists()
    ).toBeTruthy();
    expect(
      wrapper.findComponent({ name: "ToggleTopics" }).exists()
    ).toBeTruthy();

    expect(
      wrapper.findAllComponents({ name: "RepositoryListing" }).length
    ).toBe(
      TOPICS_RESPONSE_MOCK["-NPmMPnxuUlmVWFxo9DR"].filter(
        (temp) => temp.selected
      ).length
    );
  });
});
