<template>
  <div
    class="w-full border border-accented p-4 rounded-lg flex gap-3 items-start"
  >
    <div
      class="flex items-center justify-center w-8 h-8 rounded-full bg-warning text-white dark:text-black mt-1.5"
    >
      <UIcon name="i-lucide-package-minus" class="size-6" />
    </div>
    <div>
      <p class="font-bold text-3xl text-warning">4</p>
      <p class="text-xs opacity-70 text-warning">Unused</p>
    </div>
    <div class="flex-1 self-stretch flex flex-col justify-end items-end">
      <span class="text-xs">Audio</span>
      <span class="text-xs">Home Entertainment</span>
      <span class="text-xs text-warning">+2 more</span>
    </div>
  </div>
</template>
