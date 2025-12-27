<template>
  <div
    class="w-full border border-accented p-4 rounded-lg flex gap-3 items-start"
  >
    <div
      class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white dark:text-black mt-1.5"
    >
      <UIcon :name="icon" class="size-6" />
    </div>
    <div>
      <p class="font-bold text-2xl">
        <slot name="value"></slot>
      </p>
      <p class="text-xs opacity-70">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
}>();
</script>
