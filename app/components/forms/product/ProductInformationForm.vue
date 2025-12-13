<template>
  <UForm @submit.prevent="handleUpdate" class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="flex-1 flex flex-col gap-4">
        <UFormField label="Product Name">
          <UInput
            v-model="name"
            placeholder="Enter product name"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Short Description">
          <UTextarea
            v-model="summary"
            placeholder="Enter product summary"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="description"
            placeholder="Enter product description"
            class="w-full"
            rows="15"
          />
        </UFormField>
      </div>
      <div class="w-80 flex flex-col gap-4">
        <UFormField label="Price(PHP)">
          <UInput v-model="price" placeholder="0.00" class="w-full" />
        </UFormField>
        <UFormField label="Stock">
          <UInputNumber v-model="stock" placeholder="0" class="w-full" />
        </UFormField>
        <UFormField label="Brand">
          <USelect :items="brands" class="w-full" />
        </UFormField>
        <UFormField label="Categories">
          <UFieldGroup class="w-full">
            <USelectMenu
              v-model="categorySelect"
              :items="allCategories"
              color="neutral"
              variant="outline"
              placeholder="Enter token"
              class="w-full"
            />

            <UTooltip text="Attach category to product">
              <UButton
                color="neutral"
                variant="subtle"
                icon="i-lucide-plus"
                @click="handleAttachCategory"
              />
            </UTooltip>
          </UFieldGroup>
        </UFormField>
        <div class="border border-dashed border-accented p-4 rounded-lg">
          <UEmpty
            v-if="!categories.length"
            variant="naked"
            class="my-auto"
            title="No category attached"
            description="It looks like you haven't added any categories yet."
          />
          <div v-else class="flex gap-2 flex-wrap">
            <UFieldGroup
              v-for="(category, categoryKey) in categories"
              :key="`selected-category-${categoryKey}-${category.id}`"
            >
              <UBadge
                :label="category.name"
                variant="outline"
                color="neutral"
              />
              <UButton
                size="xs"
                icon="i-lucide-x"
                color="neutral"
                variant="outline"
                @click="handleRemoveCategory(category.id)"
              />
            </UFieldGroup>
          </div>
        </div>
        <div class="border border-accented px-2 py-4 rounded-lg mt-4">
          <USwitch v-model="published" label="Publish" />
        </div>
      </div>
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
</template>

<script setup lang="ts">
import { useCategoryStore } from "~/store/category.store";
import { useProductFormStore } from "~/store/productForm.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { PaginationParams } from "~/types/Global.types";
import type { Product } from "~/types/Product.types";
import type { Category } from "~/types/Category.types";
import type { SelectMenuItem } from "@nuxt/ui";

const productFormStore = useProductFormStore();
const categoryStore = useCategoryStore();
const toast = useToast();
const brands = ref(["Apple", "Samsung", "HP", "LG"]);
const loading = ref<boolean>(false);

onMounted(() => {
  categoryStore.getCategories({ page: 1, per_page: 100 } as PaginationParams);
});

const name = computed({
  get: () => productFormStore.productInformation.name,
  set: (value) => (productFormStore.productInformation!.name = value),
});

const summary = computed({
  get: () => productFormStore.productInformation.summary,
  set: (value) => (productFormStore.productInformation!.summary = value),
});

const description = computed({
  get: () => productFormStore.productInformation.description,
  set: (value) => (productFormStore.productInformation!.description = value),
});

const price = computed({
  get: () => productFormStore.productInformation.price,
  set: (value) => (productFormStore.productInformation!.price = value),
});

const stock = computed({
  get: () => productFormStore.productInformation.stock,
  set: (value) => (productFormStore.productInformation!.stock = value),
});

const published = computed({
  get: () => productFormStore.productInformation.published,
  set: (value) => (productFormStore.productInformation!.published = value),
});

const categories = computed({
  get: () => productFormStore.productInformation.categories,
  set: (value) => (productFormStore.productInformation!.categories = value),
});

const categorySelect = ref<SelectMenuItem>("");

const allCategories = computed(() => {
  return categoryStore.categories
    .filter((item) => {
      return !categories.value.find((cat) => cat.id == item.id);
    })
    .map((item: Category) => {
      return { label: item.name, value: item.id };
    });
});

const handleAttachCategory = () => {
  const selectedCat: Category | undefined = categoryStore.categories.find(
    (category) => category.id === categorySelect.value.value
  );

  if (!selectedCat) return;

  productFormStore.productInformation.categories.push(selectedCat);
};

const handleRemoveCategory = (categoryId: string) => {
  const category = productFormStore.productInformation.categories.find(
    (category) => category.id === categoryId
  );

  if (!category) {
    return;
  }

  const categoryIndex =
    productFormStore.productInformation.categories.indexOf(category);

  productFormStore.productInformation.categories.splice(categoryIndex, 1);
};

const handleUpdate = async () => {
  loading.value = true;
  try {
    const product: Product = await productFormStore.updateProductInformation();
    console.log(product);

    loading.value = false;

    toast.add({
      title: "Success",
      description: `Product has been updated successfully.`,
      icon: "i-lucide-info",
    });
  } catch (error: unknown) {
    loading.value = false;

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
