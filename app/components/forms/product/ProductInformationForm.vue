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
          <UInputTags
            icon="i-lucide-search"
            variant="outline"
            placeholder="Attach categories"
            class="w-full"
          />
        </UFormField>
        <USwitch v-model="published" label="Publish" class="mt-4" />
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
import { useProductFormStore } from "~/store/productForm.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Product } from "~/types/Product.types";

const productFormStore = useProductFormStore();
const toast = useToast();
const brands = ref(["Apple", "Samsung", "HP", "LG"]);
const loading = ref<boolean>(false);

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
