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
import type { Navigation } from "~/types/Navigation.types";

const navigation = ref<Navigation[]>([
  {
    title: "Dashboard",
    path: "/",
    icon: "i-lucide-layout-dashboard",
  },
  {
    title: "Catalog",
    icon: "i-lucide-library",
    children: [
      {
        title: "Products",
        path: "/products",
        icon: "i-lucide-layers",
      },
      {
        title: "Categories",
        path: "/categories",
        icon: "i-lucide-chart-bar-stacked",
      },
      {
        title: "Attributes",
        path: "/attributes",
        icon: "i-lucide-columns-3-cog",
      },
      {
        title: "Brands",
        path: "/brands",
        icon: "i-lucide-tag",
      },
    ],
  },
  {
    title: "Transactions",
    icon: "i-lucide-arrow-left-right",
    children: [
      {
        title: "Orders",
        path: "orders",
        icon: "i-lucide-ticket-check",
      },
      {
        title: "Returns",
        path: "returns",
        icon: "i-lucide-ticket-x",
      },
      {
        title: "Carts",
        path: "carts",
        icon: "i-lucide-shopping-bag",
      },
    ],
  },
]);
</script>
