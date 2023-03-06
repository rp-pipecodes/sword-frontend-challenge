import { rest } from "msw";
import { server } from "./../../setupTests";
import router from "@/router";
import { describe, it, expect, vi } from "vitest";
import { RouterLinkStub, flushPromises, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import MyAccountView from "@/views/MyAccountView.vue";
import i18n from "@/i18n";
import InputField from "../InputField.vue";
import { useAuthStore } from "@/stores/auth";

describe("MyAccountView.vue Test", () => {
  it("renders the component with all the elements", () => {
    const wrapper = mount(MyAccountView, {
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
          router,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    expect(wrapper.find("h1").text()).toBe(i18n.global.t("my_account.title"));

    const inputFields = wrapper.findAllComponents(InputField);
    expect(inputFields.length).toBe(2);
    expect(inputFields[0].find("input").element.type).toBe("text");
    expect(inputFields[0].find("label").text()).toBe(
      i18n.global.t("auth.username") + "*"
    );

    expect(inputFields[1].find("input").element.type).toBe("email");
    expect(inputFields[1].find("label").text()).toBe(
      i18n.global.t("auth.email") + "*"
    );

    const submitButton = wrapper
      .findComponent({ name: "PrimaryButton" })
      .find("button");
    expect(submitButton.element.type).toBe("button");
    expect(submitButton.text()).toBe(i18n.global.t("my_account.submit"));
  });

  it("validates the error messages", async () => {
    server.use(
      rest.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword",
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(AUTH_MOCK.user));
        }
      )
    );

    const wrapper = mount(MyAccountView, {
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
          router,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const inputFields = wrapper.findAllComponents(InputField);

    // reset form to test the error messages
    await inputFields[0].find("input").setValue("");
    await inputFields[1].find("input").setValue("");

    const authStore = useAuthStore();

    const submitButton = wrapper.findComponent({ name: "PrimaryButton" });
    await submitButton.trigger("click");
    const errorLabel = wrapper.find(".uk-label-danger");

    expect(authStore.updateUser).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.email_empty")
    );

    await inputFields[1].find("input").setValue("test@test");
    await submitButton.trigger("click");
    expect(authStore.updateUser).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.email_not_valid")
    );

    await inputFields[1].find("input").setValue("test@test.com");
    await submitButton.trigger("click");
    expect(authStore.updateUser).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.username_empty")
    );

    await inputFields[0].find("input").setValue("John Doe");
    await submitButton.trigger("click");
    expect(authStore.updateUser).toHaveBeenCalledOnce();
  });
});
