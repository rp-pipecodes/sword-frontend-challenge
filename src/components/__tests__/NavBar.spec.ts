import { useAuthStore } from "./../../stores/auth";
import { describe, it, expect, vi } from "vitest";
import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import NavBar from "../NavBar.vue";
import { createTestingPinia } from "@pinia/testing";
import router from "@/router";
import i18n from "@/i18n";
import AUTH_MOCK from "./mocks/auth.mock.json";

describe("NavBar.vue Test", () => {
  it("renders the NavBar component with the correct elements", () => {
    const wrapper = shallowMount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: AUTH_MOCK.user,
              },
            },
          }),
          router,
          i18n,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    expect(wrapper.find("nav").exists()).toBeTruthy();
    const routerLinks = wrapper.findAllComponents({ name: "RouterLinkStub" });

    expect(routerLinks.length).toBe(2);
    expect(routerLinks[0].text()).toBe(i18n.global.t("discovery.title"));
    expect(routerLinks[1].text()).toBe(AUTH_MOCK.user.displayName);

    const links = wrapper.findAll("a");
    expect(links[links.length - 1].text()).toBe(i18n.global.t("auth.logout"));
  });

  it("tests the logout with success", async () => {
    const wrapper = shallowMount(NavBar, {
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
          router,
          i18n,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    window.confirm = vi.fn(() => true); // confirm

    const authStore = useAuthStore();

    const links = wrapper.findAll("a");
    await links[links.length - 1].trigger("click");

    expect(authStore.logout).toHaveBeenCalledOnce();
  });

  it("tests the logout but cancel the confirmation", async () => {
    const wrapper = shallowMount(NavBar, {
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
          router,
          i18n,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const authStore = useAuthStore();

    window.confirm = vi.fn(() => false); // cancel confirmation

    const links = wrapper.findAll("a");
    await links[links.length - 1].trigger("click");

    expect(authStore.logout).toHaveBeenCalledTimes(0);
  });
});
