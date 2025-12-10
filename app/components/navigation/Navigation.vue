<template>
  <div>
    <p class="text-xs uppercase font-semibold px-2 block mb-1 text-gray-400">
      Main Menu
    </p>
    <ul>
      <NavigationItem :navigation="navigation" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";
import type { Navigation } from "~/types/Navigation.types";

const navigationStore = useNavigationStore();

const navigation = ref<Navigation[]>(navigationStore.navigation);
</script>
