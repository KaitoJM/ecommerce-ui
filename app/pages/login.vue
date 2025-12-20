<template>
  <div class="flex flex-col-reverse md:flex-row items-center">
    <div class="flex-1 h-screen p-8 bg-neutral-50 dark:bg-neutral-900">
      <ChangeLogs />
    </div>
    <div
      class="w-full md:w-150 dark:bg-neutral-950 flex flex-col items-center justify-center gap-4 p-8 h-screen"
    >
      <Logo class="w-80 mb-2" />
      <UPageCard class="w-full max-w-md">
        <UForm class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <p class="font-bold text-lg">Welcome back!</p>
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
              class="w-full"
              :type="showPassword ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>
          <UButton
            :loading="loading"
            type="submit"
            class="mt-4 flex justify-center"
            >Login</UButton
          >
        </UForm>
      </UPageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import Logo from "~/components/ui/Logo.vue";

import { ref } from "vue";
import type { User } from "~/types/User.types";
import ChangeLogs from "~/components/ChangeLogs.vue";

interface LoginResponse {
  user: User;
  token: string;
}

const config = useRuntimeConfig();
const router = useRouter();

const email = ref<string>("test@example.com");
const password = ref<string>("password");
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");
const toast = useToast();

const showPassword = ref(false);

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
    const fetchError = err as FetchError<any>;

    if (fetchError.statusCode == 401) {
      toast.add({
        title: "Invalid Credentials",
        description: "Your email or password is incorrect",
        icon: "i-lucide-lock",
        color: "error",
      });
    } else {
      toast.add({
        title: "Error",
        description:
          fetchError.data?.message ??
          fetchError.message ??
          "Something went wrong",
        icon: "i-lucide-octagon-x",
        color: "error",
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>
