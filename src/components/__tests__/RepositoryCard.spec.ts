import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import REPOSITORY_MOCK from "./mocks/repository.mock.json";
import BOOKMARKS_MOCK from "./mocks/bookmarks.mock.json";
import RepositoryCard from "../RepositoryCard.vue";
import { useDiscoveryStore } from "@/stores/discovery";

describe("RepositoryCard.vue Test", () => {
  it("render the component", () => {
    const wrapper = shallowMount(RepositoryCard, {
      propsData: {
        repository: REPOSITORY_MOCK,
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
      `https://opengraph.githubassets.com/123abc/${REPOSITORY_MOCK.fullName}`
    );
  });

  it("opens the bookmark in a new tab", async () => {
    const wrapper = shallowMount(RepositoryCard, {
      propsData: {
        repository: REPOSITORY_MOCK,
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

  it("add the repository as bookmark", async () => {
    server.use(
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      ),
      rest.post(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(""));
        }
      )
    );

    const wrapper = shallowMount(RepositoryCard, {
      propsData: {
        repository: REPOSITORY_MOCK,
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

    expect(discoveryStore.addBookmark).toHaveBeenCalledOnce();
  });

  it("remove the repository as bookmark", async () => {
    const repository = BOOKMARKS_MOCK[0];

    server.use(
      rest.get(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      ),
      rest.delete(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
          AUTH_MOCK.user.uid
        }/bookmarks/${repository.id}.json`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(""));
        }
      )
    );

    const wrapper = shallowMount(RepositoryCard, {
      propsData: {
        repository: repository,
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
              discovery: {
                bookmarks: BOOKMARKS_MOCK,
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
