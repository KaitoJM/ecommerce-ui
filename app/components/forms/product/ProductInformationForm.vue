<template>
  <UForm class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="flex-1 flex flex-col gap-4">
        <UFormField label="Product Name">
          <UInput placeholder="Enter product name" class="w-full" />
        </UFormField>
        <UFormField label="Short Description">
          <UTextarea placeholder="Enter product summary" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            placeholder="Enter product description"
            class="w-full"
            rows="15"
          />
        </UFormField>
      </div>
      <div class="w-80 flex flex-col gap-4">
        <UFormField label="Price(PHP)">
          <UInput placeholder="0.00" class="w-full" />
        </UFormField>
        <UFormField label="Stock">
          <UInputNumber placeholder="0" class="w-full" />
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
        <USwitch label="Publish" class="mt-4" />
      </div>
    </div>
    <div class="flex justify-end gap-4 border-t border-accented py-4">
      <UButton
        label="Save Product Information"
        icon="i-lucide-save"
        size="xl"
        variant="outline"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
const brands = ref(["Apple", "Samsung", "HP", "LG"]);
</script>
