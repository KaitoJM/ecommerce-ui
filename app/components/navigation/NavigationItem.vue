<template>
  <li v-for="(nav, k) in navigation" :key="`nav-item-${k}`">
    <NuxtLink
      :to="nav.path"
      :class="[
        'flex items-center gap-2 py-1 px-2',
        navigationStore.activePage?.path === nav.path
          ? 'bg-primary-700 text-white rounded-md font-medium'
          : 'opacity-50 hover:opacity-100 rounded-md',
      ]"
    >
      <UIcon v-if="nav.icon" :name="nav.icon" class="size-4 text-gray-400" />
      {{ nav.title }}
    </NuxtLink>
    <ul v-if="nav.children?.length" class="pl-2 ml-4 border-l border-gray-200">
      <NavigationItem :navigation="nav.children" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";
import type { Navigation } from "~/types/Navigation.types";

defineProps<{
  navigation: Navigation[];
}>();

const navigationStore = useNavigationStore();
</script>
