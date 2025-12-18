<template>
  <UApp :toaster="toasterConfig">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toasterConfig: ToasterProps = {
  duration: 5000,
  position: "bottom-right",
};
</script>
