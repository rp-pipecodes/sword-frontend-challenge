import { rest } from "msw";
import { server } from "./../../setupTests";
import { describe, it, expect, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import i18n from "@/i18n";
import AUTH_MOCK from "./mocks/auth.mock.json";
import ToggleTopics from "../ToggleTopics.vue";
import { useDiscoveryStore } from "@/stores/discovery";

describe("ToggleTopics.vue Test", () => {});
