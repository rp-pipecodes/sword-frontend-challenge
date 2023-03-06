import { rest } from "msw";
import { server } from "./../../setupTests";
import router from "@/router";
import { describe, it, expect, vi } from "vitest";
import { RouterLinkStub, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AUTH_MOCK from "./mocks/auth.mock.json";
import SignupView from "@/views/SignupView.vue";
import i18n from "@/i18n";
import InputField from "../InputField.vue";
import { useAuthStore } from "@/stores/auth";

describe("SignupView.vue Test", () => {
  it("renders the component with all the elements", () => {
    const wrapper = mount(SignupView, {
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

    expect(wrapper.find("h1").text()).toBe(i18n.global.t("auth.sign_up"));

    const inputFields = wrapper.findAllComponents(InputField);
    expect(inputFields.length).toBe(3);
    expect(inputFields[0].find("input").element.type).toBe("email");
    expect(inputFields[0].find("label").text()).toBe(
      i18n.global.t("auth.email")
    );

    expect(inputFields[1].find("input").element.type).toBe("password");
    expect(inputFields[1].find("label").text()).toBe(
      i18n.global.t("auth.password")
    );

    expect(inputFields[2].find("input").element.type).toBe("password");
    expect(inputFields[2].find("label").text()).toBe(
      i18n.global.t("auth.confirm_password")
    );

    const submitButton = wrapper
      .findComponent({ name: "PrimaryButton" })
      .find("button");
    expect(submitButton.element.type).toBe("submit");
    expect(submitButton.text()).toBe(i18n.global.t("auth.sign_up"));

    const signupLink = wrapper.findComponent({ name: "RouterLinkStub" });
    expect(signupLink.text()).toBe(i18n.global.t("auth.click_to_login"));
    expect(signupLink.props().to).toBe("/login");
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

    const wrapper = mount(SignupView, {
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

    const authStore = useAuthStore();

    const inputFields = wrapper.findAllComponents(InputField);

    await wrapper.find("form").trigger("submit");
    const errorLabel = wrapper.find(".uk-label-danger");

    expect(authStore.signUp).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.email_empty")
    );

    await inputFields[0].find("input").setValue("test@test");
    await wrapper.find("form").trigger("submit");
    expect(authStore.signUp).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.email_not_valid")
    );

    await inputFields[0].find("input").setValue("test@test.com");
    await wrapper.find("form").trigger("submit");
    expect(authStore.signUp).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.password_empty")
    );

    await inputFields[1].find("input").setValue("password");
    await wrapper.find("form").trigger("submit");
    expect(authStore.signUp).toHaveBeenCalledTimes(0);
    expect(errorLabel.text()).toBe(
      i18n.global.t("auth.validations.passwords_dont_match")
    );

    await inputFields[2].find("input").setValue("password");
    await wrapper.find("form").trigger("submit");
    expect(authStore.signUp).toHaveBeenCalledOnce();
  });
});
