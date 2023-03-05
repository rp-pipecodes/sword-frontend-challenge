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
const confirmPassword: Ref<string> = ref("");
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

  if (password.value !== confirmPassword.value) {
    errorMessage.value = $i18n.global.t(
      "auth.validations.passwords_dont_match"
    );
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
    <form class="auth" @submit.prevent="handleSignUp">
      <h1 class="uk-heading-small">{{ $t("auth.sign_up") }}</h1>

      <label v-if="errorMessage" class="uk-label-danger">{{
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

      <InputField
        type="password"
        name="confirm-password"
        placeholder="******"
        label-text="Confirm Password"
        classes="uk-margin-small-top"
        v-model="confirmPassword"
      />

      <PrimaryButton
        :text="$i18n.global.t('auth.sign_up')"
        class="uk-width-1-1 uk-margin-medium-top"
        type="submit"
      />

      <div class="uk-margin-small-top">
        {{ $t("auth.have_account") }}
        <RouterLink to="/login" class="uk-link">{{
          $t("auth.click_to_login")
        }}</RouterLink>
      </div>
    </form>
  </main>
</template>
