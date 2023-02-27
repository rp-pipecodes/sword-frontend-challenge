<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();

const currentRouteName = computed(() => route.name);

function handleLogout() {
  const confirm = window.confirm("Are you sure?");

  if (confirm) {
    authStore.logout().then(() => {
      router.replace({ name: "login" });
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
              >Logo</a
            >

            <ul class="uk-navbar-nav">
              <li :class="currentRouteName === 'discovery' ? 'uk-active' : ''">
                <RouterLink to="/">Discovery</RouterLink>
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
              <li><a @click="handleLogout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
