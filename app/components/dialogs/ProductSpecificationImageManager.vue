<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    title="Product Specification Image Manager"
  >
    <template #body>
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(image, imgeIndex) in productImages"
          :key="`image-${imgeIndex}`"
          :class="[
            'rounded-lg overflow-hidden',
            newSelectedImage.includes(image)
              ? 'border border-3 border-primary relative'
              : 'border-none',
          ]"
          @click="handleImageSelection(image)"
        >
          <span
            v-if="newSelectedImage.includes(image)"
            class="absolute top-1 right-1 bg-primary flex items-center justify-center w-4 h-4 rounded"
          >
            <UIcon name="i-lucide-check" class="size-3" />
          </span>
          <img :src="image" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end w-full items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Cancel"
          @click="emit('close', false)"
        />
        <UButton
          label="Done"
          variant="outline"
          @click="
            emit('done', newSelectedImage);
            emit('close', false);
          "
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useProductFormImageStore } from "~/store/productFormImage.store";

const props = defineProps<{
  selectedImages: string[];
}>();

const newSelectedImage = ref<string[]>([...props.selectedImages]);
const emit = defineEmits<{ close: [boolean]; done: [string[]] }>();

const imageStore = useProductFormImageStore();
const productImages = computed<string[]>(() => {
  return imageStore.productImages.map((image) => image.source);
});

const handleImageSelection = (img: string) => {
  if (newSelectedImage.value.includes(img)) {
    const imageIndex = newSelectedImage.value.indexOf(img);
    newSelectedImage.value.splice(imageIndex, 1);
  } else {
    newSelectedImage.value.push(img);
  }
};
</script>
