import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import { createTestingPinia } from "@pinia/testing";
import router from "@/router";
import i18n from "@/i18n";
import AUTH_MOCK from "./mocks/auth.mock.json";

describe("App.vue Test", () => {
  it("not renders the App component without any user logged in", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: null,
              },
            },
          }),
          router,
          i18n,
        ],
      },
    });

    expect(wrapper.findComponent({ name: "NavBar" }).exists()).toBeFalsy();
  });

  it("renders the App component with a user logged in", () => {
    const wrapper = mount(App, {
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
      },
    });

    expect(wrapper.findComponent({ name: "NavBar" }).exists()).toBeTruthy();
  });
});
