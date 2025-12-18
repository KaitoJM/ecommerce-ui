<template>
  <div
    class="w-full border border-accented p-4 rounded-lg flex gap-3 items-start"
  >
    <div
      class="flex items-center justify-center w-8 h-8 rounded-full bg-error text-white dark:text-black mt-1.5"
    >
      <UIcon name="i-lucide-box" class="size-6" />
    </div>
    <div class="text-error">
      <p class="font-bold text-3xl">15</p>
      <p class="text-xs opacity-70">Out of Stock</p>
    </div>
    <div class="flex-1 flex-col self-stretch flex justify-end items-end">
      <span class="text-xs text-success">98 in stock</span>
      <span class="text-xs text-warning">32 low stock</span>
    </div>
  </div>
</template>
