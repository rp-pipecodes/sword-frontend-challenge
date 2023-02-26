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
const confirmPassword: Ref<string> = ref("");
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

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords don't match";
    return false;
  }

  errorMessage.value = null;

  return true;
}

function handleSignUp() {
  if (!isFormValid()) {
    return;
  }

  authStore
    .signUp(email.value, password.value)
    .then(() => {
      router.replace({ name: "discovery" });
    })
    .catch((error) => {
      errorMessage.value = error;
    });
}
</script>

<template>
  <main class="center">
    <div class="auth">
      <h1 class="uk-heading-small">Sign Up</h1>

      <label v-show="errorMessage" class="uk-label-danger">{{
        errorMessage
      }}</label>

      <InputField
        type="email"
        name="email"
        placeholder="Email"
        label-text="Email"
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

      <InputField
        type="password"
        name="confirm-password"
        placeholder="******"
        label-text="Confirm Password"
        classes="uk-margin-small-top"
        v-model="confirmPassword"
      />

      <PrimaryButton
        text="Sign Up"
        classes="uk-width-1-1 uk-margin-medium-top"
        @click="handleSignUp"
      />

      <div class="uk-margin-small-top">
        Already have an account?
        <RouterLink to="/login" class="uk-link"
          >Click here to Log In</RouterLink
        >
      </div>
    </div>
  </main>
</template>
