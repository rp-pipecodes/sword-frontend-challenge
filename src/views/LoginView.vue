<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import InputField from "@/components/InputField.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { ref, type Ref } from "vue";
import { EMAIL_REGEX } from "@/constants";

const authStore = useAuthStore();

const email: Ref<string> = ref("");
const password: Ref<string> = ref("");
const errorMessage: Ref<string | null> = ref(null);

function isFormValid() {
  if (email.value.length === 0) {
    errorMessage.value = "Email can not be empty";
    return false;
  }

  if (!email.value.match(EMAIL_REGEX)) {
    errorMessage.value = "Email is not valid";
    return false;
  }

  if (password.value.length === 0) {
    errorMessage.value = "Password can not be empty";
    return false;
  }

  errorMessage.value = null;

  return true;
}

function handleLogin() {
  if (!isFormValid()) {
    return;
  }

  authStore
    .logIn(email.value, password.value)
    .then(() => {
      router.replace({ name: "discovery" });
    })
    .catch((error) => {
      alert(error);
    });
}
</script>

<template>
  <main>
    <h1 class="uk-heading-small">Sign In</h1>

    <label v-show="errorMessage" class="uk-label-danger">{{
      errorMessage
    }}</label>

    <InputField
      type="email"
      name="email"
      placeholder="Username"
      label-text="Username"
      v-model="email"
    />

    <InputField
      type="password"
      name="password"
      placeholder="******"
      label-text="Password"
      classes="uk-margin-small-top"
      v-model="password"
    />

    <PrimaryButton
      text="Sign In"
      classes="uk-width-1-1 uk-margin-medium-top"
      @click="handleLogin"
    />

    <div class="uk-margin-small-top">
      Don't have an account?
      <RouterLink to="/signup" class="uk-link">Click here to signup</RouterLink>
    </div>
  </main>
</template>
