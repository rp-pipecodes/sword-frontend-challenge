import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import REPOSITORY_BOOKMARK_MOCK from "./mocks/bookmark.mock.json";
import RepositoryBookmark from "../RepositoryBookmark.vue";
import { useDiscoveryStore } from "@/stores/discovery";

describe("RepositoryBookmark.vue Test", () => {
  it("render the component", () => {
    const wrapper = shallowMount(RepositoryBookmark, {
      propsData: {
        repository: REPOSITORY_BOOKMARK_MOCK,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const image = wrapper.find("img");
    expect(image.exists()).toBeTruthy();
    expect(image.element.src).toBe(
      `https://opengraph.githubassets.com/123abc/${REPOSITORY_BOOKMARK_MOCK.fullName}`
    );
  });

  it("opens the bookmark in a new tab", async () => {
    const wrapper = shallowMount(RepositoryBookmark, {
      propsData: {
        repository: REPOSITORY_BOOKMARK_MOCK,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const windowOpenMock = vi.fn();
    window.open = windowOpenMock;

    const image = wrapper.find("img");
    expect(image.exists()).toBeTruthy();
    await image.trigger("click");

    expect(windowOpenMock).toHaveBeenCalledOnce();
  });

  it("removes the bookmark", async () => {
    server.use(
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      ),
      // Model any response overrides you need.
      rest.delete(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks/${REPOSITORY_BOOKMARK_MOCK.id}.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(""));
        }
      )
    );

    const wrapper = shallowMount(RepositoryBookmark, {
      propsData: {
        repository: REPOSITORY_BOOKMARK_MOCK,
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

    const discoveryStore = useDiscoveryStore();

    const removeButton = wrapper.find("span");
    expect(removeButton.exists()).toBeTruthy();
    await removeButton.trigger("click");

    expect(discoveryStore.removeBookmark).toHaveBeenCalledOnce();
  });
});
