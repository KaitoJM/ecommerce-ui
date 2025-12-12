<template>
  <div>sdfds</div>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";

definePageMeta({
  layout: "main-template",
});

const navigationStore = useNavigationStore();

onMounted(() => {
  navigationStore.setPageTitle("Manage Product");
});
</script>
