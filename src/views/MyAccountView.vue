<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import InputField from "@/components/InputField.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, type Ref } from "vue";
import { EMAIL_REGEX } from "@/constants/validations";
import $i18n from "@/i18n";

const authStore = useAuthStore();

const email: Ref<string> = ref(authStore.user?.email || "");
const username: Ref<string> = ref(authStore.user?.displayName || "");
const errorMessage: Ref<string | null> = ref(null);
const successMessage: Ref<string | null | undefined> = ref(null);

function isFormValid() {
  if (email.value.length === 0) {
    errorMessage.value = $i18n.global.t("auth.validations.email_empty");
    return false;
  }

  if (!email.value.match(EMAIL_REGEX)) {
    errorMessage.value = $i18n.global.t("auth.validations.email_not_valid");
    return false;
  }

  if (username.value.length === 0) {
    errorMessage.value = $i18n.global.t("auth.validations.username_empty");
    return false;
  }

  errorMessage.value = null;

  return true;
}

function handleUpdate() {
  if (!isFormValid()) {
    return;
  }

  authStore
    .updateUser(username.value, email.value)
    .then((message) => {
      successMessage.value = message;
    })
    .catch((error) => {
      errorMessage.value = error;
    });
}
</script>

<template>
  <main>
    <div class="my-account">
      <h1 class="uk-heading-small">{{ $t("my_account.title") }}</h1>

      <label v-if="errorMessage" class="uk-label-danger">{{
        errorMessage
      }}</label>

      <label v-if="successMessage" class="uk-label-success">{{
        successMessage
      }}</label>

      <InputField
        type="text"
        name="username"
        :placeholder="$i18n.global.t('auth.username')"
        :label-text="$i18n.global.t('auth.username') + '*'"
        v-model="username"
      />

      <InputField
        type="email"
        name="email"
        :placeholder="$i18n.global.t('auth.email')"
        :label-text="$i18n.global.t('auth.email') + '*'"
        classes="uk-margin-small-top"
        v-model="email"
      />

      <PrimaryButton
        type="button"
        :text="$i18n.global.t('my_account.submit')"
        class="uk-width-1-1 uk-margin-medium-top"
        @click="handleUpdate"
      />
    </div>
  </main>
</template>

<style scoped>
.my-account {
  display: flex;
  flex-direction: column;
  max-width: 330px;
}
</style>
