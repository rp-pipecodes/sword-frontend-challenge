import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { auth } from "@/services/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User,
} from "firebase/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const loggedIn: Ref<boolean> = ref(false);
    const user: Ref<User | null> = ref(null);

    async function logIn(email: string, password: string) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        user.value = response.user;
        loggedIn.value = true;

        return Promise.resolve("success");
      } else {
        return Promise.reject("login failed");
      }
    }

    async function signUp(email: string, password: string) {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (response) {
        user.value = response.user;
        loggedIn.value = true;

        return Promise.resolve("success");
      } else {
        return Promise.reject("login failed");
      }
    }

    return { loggedIn, user, logIn, signUp };
  },
  {
    persist: true,
  }
);
