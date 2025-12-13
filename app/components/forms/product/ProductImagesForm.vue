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
          :loading="uploading"
          @click="handleUpload"
        />
        <div v-if="uploading" class="flex flex-col gap-1">
          <p class="text-xs">
            Uploading {{ uploadCount }} of {{ file.length }}. Please wait...
          </p>
          <UProgress v-model="uploadCount" :max="file.length" />
        </div>
      </div>
      <div
        class="flex-1 flex flex-wrap border border-dashed border-accented p-4 rounded-lg min-h-125"
      >
        <UEmpty
          v-if="!images.length"
          variant="naked"
          class="m-auto"
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
              <div class="p-1 bg-accented flex gap-1">
                <UBadge
                  v-if="image.cover"
                  label="Cover"
                  color="primary"
                  variant="solid"
                  icon="i-lucide-check"
                  class="w-full flex justify-center font-bold"
                />
                <UButton
                  v-else
                  label="Set Cover"
                  variant="soft"
                  size="xs"
                  color="primary"
                  class="w-full flex justify-center"
                  :loading="settingCover == image.id"
                  @click="setCover(image.id)"
                />
                <UButton
                  icon="i-lucide-trash"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :loading="deletingImage == image.id"
                  @click="handleDeleteImageClick(image.id)"
                />
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
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import { useProductFormStore } from "~/store/productForm.store";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";

const productFormStore = useProductFormStore();
const toast = useToast();
const file = ref<File[]>([]);

const images = computed({
  get: () => productFormStore.productImages,
  set: (value) => (productFormStore.productImages = value),
});

const productID = computed(() => productFormStore.product?.id);
const uploading = ref<boolean>(false);
const uploadCount = ref(0);

const handleUpload = async () => {
  if (!file.value.length) return;
  if (!productID) return;

  uploading.value = true;
  uploadCount.value = 0;

  await Promise.all(
    file.value.map(async (f) => {
      await upload(f);
      uploadCount.value++;
    })
  );

  await productFormStore.getProductImages(productID.value as string);
  file.value = [];
  uploading.value = false;
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
    toast.add({
      title: "Error",
      description:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      icon: "i-lucide-octagon-x",
      color: "error",
    });

    console.error(`Failed to upload product image: ${file.name}`, error);
  }
};

const settingCover = ref<string | null>(null);
const setCover = async (id: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(
      `Failed to change product cover image: ${id}`,
      "No auth token found"
    );
    throw {
      message: "Authentication required. Please log in again.",
      statusCode: 401,
    } satisfies ApiError;
  }

  settingCover.value = id;

  try {
    const response = await $fetch(
      `${config.public.apiBase}/product-images-cover/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    settingCover.value = null;
    productFormStore.getProductImages(productID.value as string);
  } catch (error) {
    const fetchError = error as FetchError<any>;
    toast.add({
      title: "Error",
      description:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      icon: "i-lucide-octagon-x",
      color: "error",
    });

    settingCover.value = null;
    console.error(`Failed to change product cover image: ${id}`, error);
  }
};

const overlay = useOverlay();
const deleteModel = overlay.create(ConfirmationDialog);
const handleDeleteImageClick = (id: string) => {
  deleteModel.open({
    title: "Delete Product Image",
    message: "Are you sure you want to delete this image from this product?",
    onOk: () => {
      deleteImage(id);
    },
  });
};

const deletingImage = ref<string | null>(null);
const deleteImage = async (id: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(
      `Failed to delete product image: ${id}`,
      "No auth token found"
    );
    throw {
      message: "Authentication required. Please log in again.",
      statusCode: 401,
    } satisfies ApiError;
  }

  deletingImage.value = id;

  try {
    const response = await $fetch(
      `${config.public.apiBase}/product-images/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    deletingImage.value = null;
    productFormStore.getProductImages(productID.value as string);
  } catch (error) {
    const fetchError = error as FetchError<any>;
    toast.add({
      title: "Error",
      description:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      icon: "i-lucide-octagon-x",
      color: "error",
    });

    deletingImage.value = null;
    console.error(`Failed to delete product image: ${id}`, error);
  }
};
</script>
