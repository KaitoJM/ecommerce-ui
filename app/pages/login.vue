<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-screen">
    <Logo class="w-60" />
    <UPageCard class="w-full max-w-md">
      <UForm class="flex flex-col gap-4" @submit.prevent="handleLogin">
        <UFormField label="Email">
          <UInput
            v-model="email"
            placeholder="Enter your email"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Password">
          <UInput
            v-model="password"
            placeholder="Enter your password"
            type="password"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" class="mt-4 flex justify-center">Login</UButton>
      </UForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import Logo from "~/components/ui/Logo.vue";

import { ref } from "vue";
import type { User } from "~/types/User.types";

interface LoginResponse {
  user: User;
  token: string;
}

const config = useRuntimeConfig();
const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res: LoginResponse = await $fetch(`${config.public.apiBase}/login`, {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    router.push("/");
  } catch (err) {
    const error = err as {
      statusCode?: number;
      data?: {
        message: string;
      };
    };

    if (error?.statusCode == 422) {
      errorMessage.value = error?.data?.message || "";
    }
  } finally {
    loading.value = false;
  }
};
</script>
