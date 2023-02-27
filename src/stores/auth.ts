import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { auth } from "@/services/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User,
  signOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user: Ref<User | null> = ref(null);

    async function logIn(email: string, password: string) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        user.value = response.user;

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

        return Promise.resolve("success");
      } else {
        return Promise.reject("login failed");
      }
    }

    async function logout() {
      await signOut(auth);

      user.value = null;

      return Promise.resolve();
    }

    async function updateUser(username: string, email: string) {
      if (!auth.currentUser) {
        return;
      }

      const newUser: User = {
        ...auth.currentUser,
        email: email,
        displayName: username,
      };

      await updateEmail(auth.currentUser, email);
      await updateProfile(auth.currentUser, { displayName: username });

      user.value = newUser;

      return Promise.resolve("Profile updated successfully");
    }

    return { user, logIn, signUp, logout, updateUser };
  },
  {
    persist: true,
  }
);
