<template>
  <UForm class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="w-80 flex flex-col gap-4">
        <UFileUpload
          v-model="file"
          layout="list"
          multiple
          label="Drop your images here"
          description="PNG, JPG or GIF (max. 2MB)"
          class="w-full"
          :ui="{
            base: 'min-h-48',
          }"
        />
        <UButton
          label="Upload this image"
          variant="outline"
          color="neutral"
          icon="i-lucide-upload"
          class="flex justify-center"
          @click="handleUpload"
        />
      </div>
      <div
        class="flex-1 flex flex-wrap border border-dashed border-accented p-4 rounded-lg min-h-125"
      >
        <UEmpty
          v-if="!images.length"
          variant="naked"
          class="my-auto"
          icon="i-lucide-image"
          title="No image found"
          description="It looks like you haven't added any images. Upload one to get started."
        />
        <template v-else>
          <div
            v-for="(image, imageIndex) in images"
            :key="`product-image-${imageIndex}-${image.id}`"
            class="w-1/5 p-2"
          >
            <div class="rounded-lg overflow-hidden border border-accented">
              <img
                :src="image.source"
                alt=""
                class="h-32 w-full object-cover"
              />
              <div class="p-2 bg-accented">
                <UFieldGroup class="w-full">
                  <UBadge
                    v-if="image.cover"
                    label="Cover"
                    color="primary"
                    icon="i-lucide-check"
                    class="w-full flex justify-center font-bold"
                  />
                  <UButton
                    v-else
                    label="Set Cover"
                    variant="outline"
                    class="w-full flex justify-center"
                  />
                  <UButton icon="i-lucide-trash" color="error" />
                </UFieldGroup>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import { useProductFormStore } from "~/store/productForm.store";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";

const productFormStore = useProductFormStore();
const file = ref<File[]>([]);

const images = computed({
  get: () => productFormStore.productImages,
  set: (value) => (productFormStore.productImages = value),
});

const productID = computed(() => productFormStore.product?.id);

const handleUpload = async () => {
  if (!file.value.length) return;
  if (!productID) return;

  await Promise.all(file.value.map((f: File) => upload(f)));

  await productFormStore.getProductImages(productID.value as string);
  file.value = [];
};

const config = useRuntimeConfig();
const upload = async (file: File) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(
      `Failed to upload product image: ${file.name}`,
      "No auth token found"
    );
    throw {
      message: "Authentication required. Please log in again.",
      statusCode: 401,
    } satisfies ApiError;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("product_id", productID.value!);
  formData.append("cover", "0");

  try {
    const response = await $fetch(`${config.public.apiBase}/product-images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });
  } catch (error) {
    const fetchError = error as FetchError<any>;

    const apiError: ApiError = {
      message:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      errors: fetchError.data?.errors,
      statusCode: fetchError.status,
    };

    console.error(`Failed to upload product image: ${file.name}`, error);
    throw apiError;
  }
};
</script>
