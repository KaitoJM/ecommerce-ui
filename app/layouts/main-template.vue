<script setup lang="ts">
import type NavigationVue from "~/components/navigation/Navigation.vue";
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <Navigation />
      </UPageAside>
    </template>
    <slot></slot>
  </UPage>
</template>
