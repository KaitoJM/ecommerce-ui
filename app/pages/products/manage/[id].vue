<template>
  <div>
    <UTabs :items="tabItems">
      <template #information>
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-full" />
          </UFormField>
        </UForm>
      </template>

      <template #pricing>
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Current Password" name="current" required>
            <UInput
              v-model="state.currentPassword"
              type="password"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="New Password" name="new" required>
            <UInput
              v-model="state.newPassword"
              type="password"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Confirm Password" name="confirm" required>
            <UInput
              v-model="state.confirmPassword"
              type="password"
              required
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #images>
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-full" />
          </UFormField>
        </UForm>
      </template>
      <template #combination>
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-full" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";

definePageMeta({
  layout: "main-template",
});

const navigationStore = useNavigationStore();
const tabItems = [
  {
    label: "Product Information",
    slot: "information",
  },
  {
    label: "Pricing",
    slot: "pricing",
  },
  {
    label: "Images",
    slot: "images",
  },
  {
    label: "Combinations",
    slot: "combination",
  },
];

onMounted(() => {
  navigationStore.setPageTitle("Manage Product");
});

const state = reactive({
  name: "Benjamin Canac",
  username: "benjamincanac",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
</script>
