<template>
  <form @submit.prevent="handleCreate">
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Product</h1>
      <UFormField label="Product" help="The name of the product.">
        <UInput
          v-model="name"
          placeholder="Enter product name"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Short description"
        help="Write a short description of the product"
        hint="(Optional)"
      >
        <UTextarea
          v-model="summary"
          placeholder="Tell us what your product is about..."
          class="w-full"
        />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton type="submit" label="Create Product" variant="outline" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useProductFormStore } from "~/store/productForm.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Product } from "~/types/Product.types";

const productFormStore = useProductFormStore();
const router = useRouter();
const toast = useToast();
const name = ref<string>("");
const summary = ref<string>("");

const handleCreate = async () => {
  try {
    const added: Product = await productFormStore.createProduct({
      name: name.value,
      summary: summary.value,
    });

    toast.add({
      title: "Success",
      description: `A new product has been successfully added.`,
      icon: "i-lucide-info",
    });

    router.push(`/products/${added.id}/manage`);
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
