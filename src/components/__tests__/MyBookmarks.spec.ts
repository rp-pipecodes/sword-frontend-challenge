import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import i18n from "@/i18n";
import AUTH_MOCK from "./mocks/auth.mock.json";
import BOOKMARKS_RESPONSE_MOCK from "./mocks/bookmarks-response.mock.json";
import MyBookmarks from "../MyBookmarks.vue";
import { useDiscoveryStore } from "@/stores/discovery";

describe("MyBookmarks.vue Test", () => {
  it("not renders the component if no bookmarks", async () => {
    server.use(
      // Model any response overrides you need.
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      )
    );

    const wrapper = shallowMount(MyBookmarks, {
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

    expect(discoveryStore.getBookmarks).toHaveBeenCalledOnce();

    expect(wrapper.find("h1").exists()).toBeFalsy();

    expect(
      wrapper.findAllComponents({ name: "RepositoryBookmark" }).length
    ).toBe(0);
  });

  it("render the component with bookmarks", async () => {
    server.use(
      // Model any response overrides you need.
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(BOOKMARKS_RESPONSE_MOCK));
        }
      )
    );

    const wrapper = shallowMount(MyBookmarks, {
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

    expect(discoveryStore.getBookmarks).toHaveBeenCalledOnce();

    const title = wrapper.find("h1");
    expect(title.exists()).toBeTruthy();
    expect(title.text()).toBe(i18n.global.t("bookmarks.title"));

    expect(
      wrapper.findAllComponents({ name: "RepositoryBookmark" }).length
    ).toBeGreaterThanOrEqual(1);
  });
});
