import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputField from "../InputField.vue";

describe("InputField.vue Test", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(InputField, {
      propsData: {
        labelText: "Label Text",
        type: "email",
        placeholder: "Test Placeholder",
        name: "name-input",
      },
    });

    const label = wrapper.find("label");
    expect(label.text()).toBe("Label Text");

    const input = wrapper.find("input");
    expect(input.element.type).toBe("email");
    expect(input.element.placeholder).toBe("Test Placeholder");
    expect(input.element.name).toBe("name-input");
  });

  it("modelValue should be updated", async () => {
    const wrapper = shallowMount(InputField, {
      props: {
        modelValue: "initialText",
        "onUpdate:modelValue": (e: Event) =>
          wrapper.setProps({ modelValue: e }),
      },
    });

    await wrapper.find("input").setValue("test");
    expect(wrapper.props("modelValue")).toBe("test");
  });
});
