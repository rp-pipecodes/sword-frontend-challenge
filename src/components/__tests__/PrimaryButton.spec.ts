import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PrimaryButton from "../PrimaryButton.vue";

describe("InputField.vue Test", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(PrimaryButton, {
      propsData: {
        text: "Primary Button Text",
        type: "submit",
      },
    });

    const button = wrapper.find("button");
    expect(button.text()).toBe("Primary Button Text");

    expect(button.element.type).toBe("submit");
  });
});
