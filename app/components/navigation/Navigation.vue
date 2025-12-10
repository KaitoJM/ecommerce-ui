<template>
  <ul class="px-4">
    <NavigationItem :navigation="navigation" />
  </ul>
</template>

<script setup lang="ts">
import type { Navigation } from "~/types/Navigation.types";

const navigation = ref<Navigation[]>([
  {
    title: "Dashboard",
    path: "/",
  },
  {
    title: "Catalog",
    children: [
      {
        title: "Products",
        path: "/products",
      },
      {
        title: "Categories",
        path: "/categories",
      },
      {
        title: "Attributes",
        path: "/attributes",
      },
      {
        title: "Brands",
        path: "/brands",
      },
    ],
  },
  {
    title: "Transactions",
    children: [
      {
        title: "Orders",
        path: "orders",
      },
      {
        title: "Returns",
        path: "returns",
      },
      {
        title: "Carts",
        path: "carts",
      },
    ],
  },
]);
</script>
