<template>
  <UButton
    :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
    color="neutral"
    variant="ghost"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
    @click="isDark = !isDark"
  />

  <template #fallback>
    <div class="size-8"></div>
  </template>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
