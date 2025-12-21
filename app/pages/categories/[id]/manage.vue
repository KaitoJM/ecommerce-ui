<template>
  <div>
    <UForm class="flex flex-col gap-4" @submit.prevent="updateCategory()">
      <div>
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
      <div class="flex justify-end gap-4 border-t border-accented py-4">
        <UButton
          :loading="loading"
          type="submit"
          label="Save Product Information"
          icon="i-lucide-save"
          size="xl"
          variant="outline"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from "~/store/category.store";
import { useCategoryFormStore } from "~/store/categoryForm.store";
import { useNavigationStore } from "~/store/navigation.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Category } from "~/types/Category.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const navigationStore = useNavigationStore();
const categoryStore = useCategoryStore();
const categoryFormStore = useCategoryFormStore();
const route = useRoute();
const toast = useToast();

// form fields declarations
const name = computed({
  get: () => categoryFormStore.categoryInformation.name,
  set: (value) => (categoryFormStore.categoryInformation!.name = value),
});

const description = computed({
  get: () => categoryFormStore.categoryInformation.description,
  set: (value) => (categoryFormStore.categoryInformation!.description = value),
});

const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    const category: Category = await categoryFormStore.getCategory(
      route.params.id as string
    );
    navigationStore.setPageTitle(`Manage Category "${category.name}"`);
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

const updateCategory = async () => {
  loading.value = true;
  try {
    await categoryStore.updateCategory(route.params.id as string, {
      name: name.value,
      description: description.value,
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
