<script setup lang="ts">
import { TOAST_OPTIONS } from "@/constants/toasts";
import $i18n from "@/i18n";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";

const authStore = useAuthStore();
const route = useRoute();
const $toast = useToast();

const currentRouteName = computed(() => route.name);

function handleLogout() {
  const confirm = window.confirm($i18n.global.t("auth.logout_confirmation"));

  if (confirm) {
    authStore
      .logout()
      .then(() => {
        router.replace({ name: "login" });
      })
      .catch((error) => {
        $toast.error(error, TOAST_OPTIONS);
      });
  }
}
</script>

<template>
  <div
    uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky"
  >
    <nav class="uk-navbar-container">
      <div class="uk-container">
        <div uk-navbar>
          <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="#" aria-label="Back to Home"
              >LOGO</a
            >

            <ul class="uk-navbar-nav">
              <li :class="currentRouteName === 'discovery' ? 'uk-active' : ''">
                <RouterLink to="/">{{ $t("discovery.title") }}</RouterLink>
              </li>
            </ul>
          </div>

          <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
              <li :class="currentRouteName === 'my-account' ? 'uk-active' : ''">
                <RouterLink to="/my-account">{{
                  authStore.user?.displayName || authStore.user?.email
                }}</RouterLink>
              </li>
              <li>
                <a @click="handleLogout">{{ $t("auth.logout") }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
