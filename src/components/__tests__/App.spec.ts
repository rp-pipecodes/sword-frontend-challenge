import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import { createTestingPinia } from "@pinia/testing";
import router from "@/router";
import i18n from "@/i18n";
import USER_MOCK from "./mocks/user.mock.json";

describe("App.vue Test", () => {
  it("not renders the NavBar component without any user logged in", () => {
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

  it("renders the NavBar component with a user logged in", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: USER_MOCK,
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
