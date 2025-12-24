<template>
  <form @submit.prevent="handleCreate">
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Customer</h1>
      <UFormField label="First Name" help="The first name of the customer.">
        <UInput v-model="first_name" placeholder="Juan" class="w-full" />
      </UFormField>
      <UFormField label="Last Name" help="The last name of the customer.">
        <UInput v-model="last_name" placeholder="Dela Cruz" class="w-full" />
      </UFormField>
      <UFormField label="Middle Name" help="The middle name of the customer.">
        <UInput v-model="middle_name" class="w-full" />
      </UFormField>
      <!-- <UFormField label="Birthday" help="The Date of birth of the customer.">
        <UInputDate v-model="birthday" class="w-full" />
      </UFormField> -->
      <UFormField label="Phone" help="Contact phone number of the customer.">
        <UInput v-model="phone" class="w-full" />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton type="submit" label="Create Customer" variant="outline" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCategoryStore } from "~/store/category.store";
import { useCustomerStore } from "~/store/customer.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Gender } from "~/types/Customer.types";

// composable declarations
const customerStore = useCustomerStore();
const toast = useToast();

// emits
const emit = defineEmits<{ done: [boolean] }>();

// form fields declarations
const first_name = ref<string>("");
const last_name = ref<string>("");
const middle_name = ref<string>("");
const birthday = ref("");
const gender = ref<Gender>("male");
const phone = ref<string>("");
const user_id = ref<string>("");

const clearForm = () => {
  (first_name.value = ""),
    (last_name.value = ""),
    (middle_name.value = ""),
    (gender.value = "male"),
    (phone.value = ""),
    (user_id.value = "");
  // (birthday.value = ""),
};

const handleCreate = async () => {
  try {
    await customerStore.storeCustomer({
      first_name: first_name.value,
      last_name: last_name.value,
      middle_name: middle_name.value,
      gender: gender.value,
      birthday: birthday.value,
      phone: phone.value,
      user_id: user_id.value,
    });

    toast.add({
      title: "Success",
      description: `A new customer has been successfully added.`,
      icon: "i-lucide-info",
    });

    clearForm();
    emit("done", true);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
    console.error(error);
  }
};
</script>
