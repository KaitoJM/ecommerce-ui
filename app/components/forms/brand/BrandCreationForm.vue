<template>
  <form @submit.prevent="handleCreate">
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Brand</h1>
      <UFormField label="Brand" help="The name of the brand.">
        <UInput v-model="name" placeholder="Enter brand name" class="w-full" />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton type="submit" label="Create Brand" variant="outline" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useBrandStore } from "~/store/brand.store";
import type { ApiError } from "~/types/ApiResponses.types";

// composable declarations
const brandStore = useBrandStore();
const toast = useToast();

// emits
const emit = defineEmits<{ done: [boolean] }>();

// form fields declarations
const name = ref<string>("");

const clearForm = () => {
  name.value = "";
};

const handleCreate = async () => {
  try {
    await brandStore.storeBrand({
      name: name.value,
      image: "",
    });

    toast.add({
      title: "Success",
      description: `A new brand has been successfully added.`,
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
