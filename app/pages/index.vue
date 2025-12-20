<template>
  <div class="h-full flex flex-col items-center justify-center">
    <UEmpty
      variant="naked"
      icon="i-lucide-brush-cleaning"
      title="No Contents Yet"
      description="We’re still working on the dashboard. In the meantime, you can explore the other pages available."
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "main-template",
  middleware: "auth",
});
</script>
