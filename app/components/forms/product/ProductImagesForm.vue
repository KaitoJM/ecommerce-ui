<template>
  <UForm class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="w-80 flex flex-col gap-4">
        <UFileUpload
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
        />
      </div>
      <div
        class="flex-1 flex flex-col gap-4 flex-wrap border border-dashed border-accented p-4 rounded-lg min-h-125"
      >
        <UEmpty
          variant="naked"
          class="my-auto"
          icon="i-lucide-image"
          title="No image found"
          description="It looks like you haven't added any images. Upload one to get started."
        />
      </div>
    </div>
  </UForm>
</template>
