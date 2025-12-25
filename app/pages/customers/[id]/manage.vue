<template>
  <div>
    <UForm class="flex flex-col gap-4" @submit.prevent="updateCustomer()">
      <div class="flex flex-col gap-4 max-w-100">
        <UFormField label="First Name">
          <UInput v-model="first_name" placeholder="Juan" class="w-full" />
        </UFormField>
        <UFormField label="Last Name">
          <UInput v-model="last_name" placeholder="Dela Cruz" class="w-full" />
        </UFormField>
        <UFormField label="Middle Name">
          <UInput v-model="middle_name" class="w-full" />
        </UFormField>
        <UFormField label="Gender">
          <USelect v-model="gender" :items="genderItems" class="w-full" />
        </UFormField>
        <UFormField label="Birthday">
          <UInput v-model="birthday" class="w-full" placeholder="1993-10-04" />
        </UFormField>
        <UFormField label="Phone Number">
          <UInput v-model="phone" class="w-full" />
        </UFormField>
      </div>
      <div class="flex justify-end gap-4 border-t border-accented py-4 mt-8">
        <UButton
          :loading="loading"
          type="submit"
          label="Save Customer Information"
          icon="i-lucide-save"
          size="xl"
          variant="outline"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/store/customer.store";
import { useCustomerFormStore } from "~/store/customerForm.store";
import { useNavigationStore } from "~/store/navigation.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Customer } from "~/types/Customer.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const navigationStore = useNavigationStore();
const customerStore = useCustomerStore();
const customerFormStore = useCustomerFormStore();
const route = useRoute();
const toast = useToast();

const genderItems = ref(["male", "female"]);

// form fields declarations
const first_name = computed({
  get: () => customerFormStore.customerInformation.first_name,
  set: (value) => (customerFormStore.customerInformation!.first_name = value),
});

const last_name = computed({
  get: () => customerFormStore.customerInformation.last_name,
  set: (value) => (customerFormStore.customerInformation!.last_name = value),
});

const middle_name = computed({
  get: () => customerFormStore.customerInformation.middle_name,
  set: (value) => (customerFormStore.customerInformation!.middle_name = value),
});

const gender = computed({
  get: () => customerFormStore.customerInformation.gender,
  set: (value) => (customerFormStore.customerInformation!.gender = value),
});

const birthday = computed({
  get: () => customerFormStore.customerInformation.birthday,
  set: (value) => (customerFormStore.customerInformation!.birthday = value),
});

const phone = computed({
  get: () => customerFormStore.customerInformation.phone,
  set: (value) => (customerFormStore.customerInformation!.phone = value),
});

const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    const customer: Customer = await customerFormStore.getCustomer(
      route.params.id as string
    );
    navigationStore.setPageTitle(
      `Manage Customer "${customer.first_name} ${customer.last_name}"`
    );
  } catch (error) {
    loading.value = false;

    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const updateCustomer = async () => {
  loading.value = true;
  try {
    await customerStore.updateCustomer(route.params.id as string, {
      first_name: first_name.value,
      last_name: last_name.value,
      middle_name: middle_name.value,
      gender: gender.value,
      birthday: birthday.value,
      phone: phone.value,
    });

    toast.add({
      title: "Success",
      description: "Customer saved successfully.",
      icon: "i-lucide-check",
      color: "success",
    });
  } catch (error) {
    loading.value = false;

    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
