<template>
  <form @submit.prevent="handleCreate">
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Category</h1>
      <UFormField label="Category" help="The name of the category.">
        <UInput
          v-model="name"
          placeholder="Enter category name"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Short description"
        help="Write a description of the category"
        hint="(Optional)"
      >
        <UTextarea
          v-model="description"
          placeholder="Tell us what the category is about..."
          class="w-full"
        />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton type="submit" label="Create Category" variant="outline" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCategoryStore } from "~/store/category.store";
import type { ApiError } from "~/types/ApiResponses.types";

// composable declarations
const categoryStore = useCategoryStore();
const toast = useToast();

// form fields declarations
const name = ref<string>("");
const description = ref<string>("");

const clearForm = () => {
  (name.value = ""), (description.value = "");
};

const handleCreate = async () => {
  try {
    await categoryStore.storeCategory({
      name: name.value,
    });

    toast.add({
      title: "Success",
      description: `A new category has been successfully added.`,
      icon: "i-lucide-info",
    });

    clearForm();
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
