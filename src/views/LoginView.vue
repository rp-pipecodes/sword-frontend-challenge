<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import InputField from "@/components/InputField.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { ref, type Ref } from "vue";
import { EMAIL_REGEX } from "@/constants/validations";
import $i18n from "@/i18n";

const authStore = useAuthStore();

const email: Ref<string> = ref("");
const password: Ref<string> = ref("");
const errorMessage: Ref<string | null> = ref(null);

function isFormValid() {
  if (email.value.length === 0) {
    errorMessage.value = $i18n.global.t("auth.validations.email_empty");
    return false;
  }

  if (!email.value.match(EMAIL_REGEX)) {
    errorMessage.value = $i18n.global.t("auth.validations.email_not_valid");
    return false;
  }

  if (password.value.length === 0) {
    errorMessage.value = $i18n.global.t("auth.validations.password_empty");
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
      errorMessage.value = error;
    });
}
</script>

<template>
  <main class="center">
    <div class="auth">
      <h1 class="uk-heading-small">Sign In</h1>

      <label v-show="errorMessage" class="uk-label-danger">{{
        errorMessage
      }}</label>

      <InputField
        type="email"
        name="email"
        :placeholder="$i18n.global.t('auth.email')"
        :label-text="$i18n.global.t('auth.email')"
        v-model="email"
      />

      <InputField
        type="password"
        name="password"
        placeholder="******"
        :label-text="$i18n.global.t('auth.password')"
        classes="uk-margin-small-top"
        v-model="password"
      />

      <PrimaryButton
        :text="$i18n.global.t('auth.sign_in')"
        class="uk-width-1-1 uk-margin-medium-top"
        @click="handleLogin"
      />

      <div class="uk-margin-small-top">
        {{ $t("auth.no_account") }}
        <RouterLink to="/signup" class="uk-link">{{
          $t("auth.click_to_signup")
        }}</RouterLink>
      </div>
    </div>
  </main>
</template>
