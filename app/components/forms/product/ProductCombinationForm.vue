<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="w-80 flex flex-col gap-4">
        <UFormField label="Attribute">
          <UFieldGroup class="w-full">
            <USelectMenu placeholder="Attributes" :items="attributeItems" />
            <UInput placeholder="Attribute value" />
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-plus"
              label="Add"
            />
          </UFieldGroup>
        </UFormField>
        <p class="text-xs">
          If you did not see your prefered attribute from the list, You can add
          new by clicking
          <NuxtLink class="text-primary">here</NuxtLink>.
        </p>
        <UEmpty
          icon="i-lucide-file"
          title="No selected attributes yet"
          description="You did not set any attribute for this product yet. it is requried that you set one or more attribute before we can generate a combinations for you."
        />
        <UButton
          label="Generate Combinations"
          variant="outline"
          color="neutral"
          class="flex justify-center"
        />
      </div>
      <div
        class="flex-1 flex flex-col gap-4 flex-wrap border border-dashed border-accented p-4 rounded-lg min-h-125"
      >
        <UEmpty
          variant="naked"
          class="my-auto"
          icon="i-lucide-file"
          title="No combinations found"
          description="It looks like you haven't generated any combinations yet."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const attributeItems = ref(["Size", "Color", "Memory", "Storage"]);
</script>
