<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import InputField from "@/components/InputField.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, type Ref } from "vue";
import { EMAIL_REGEX } from "@/constants";

const authStore = useAuthStore();

const email: Ref<string> = ref(authStore.user?.email || "");
const username: Ref<string> = ref(authStore.user?.displayName || "");
const errorMessage: Ref<string | null> = ref(null);
const successMessage: Ref<string | null | undefined> = ref(null);

function isFormValid() {
  if (email.value.length === 0) {
    errorMessage.value = "Email can not be empty";
    return false;
  }

  if (!email.value.match(EMAIL_REGEX)) {
    errorMessage.value = "Email is not valid";
    return false;
  }

  if (username.value.length === 0) {
    errorMessage.value = "Username can not be empty";
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
      <h1 class="uk-heading-small">My Account</h1>

      <label v-show="errorMessage" class="uk-label-danger">{{
        errorMessage
      }}</label>

      <label v-show="successMessage" class="uk-label-success">{{
        successMessage
      }}</label>

      <InputField
        type="test"
        name="username"
        placeholder="Username"
        label-text="Username*"
        v-model="username"
      />

      <InputField
        type="email"
        name="email"
        placeholder="Email"
        label-text="Email*"
        classes="uk-margin-small-top"
        v-model="email"
      />

      <PrimaryButton
        text="Save"
        classes="uk-width-1-1 uk-margin-medium-top"
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
