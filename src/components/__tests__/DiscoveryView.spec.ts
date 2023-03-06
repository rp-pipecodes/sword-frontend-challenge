import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import TOPICS_RESPONSE_MOCK from "./mocks/topics-response.mock.json";
import { useDiscoveryStore } from "@/stores/discovery";
import DiscoveryView from "@/views/DiscoveryView.vue";
import i18n from "@/i18n";

describe("DiscoveryView.vue Test", () => {
  it("renders the component", async () => {
    server.use(
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      ),
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

    const wrapper = mount(DiscoveryView, {
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
