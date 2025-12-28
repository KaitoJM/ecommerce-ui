<template>
  <UTable
    ref="table"
    sticky
    :data="items"
    :columns="columns"
    loading-color="primary"
    loading-animation="carousel"
  />
</template>

<script setup lang="ts">
import type { TableRow } from "@nuxt/ui";
import type { TableColumn } from "@nuxt/ui";
import type { OrderItemListItem } from "~/types/Order.types";

const props = defineProps<{
  items: OrderItemListItem[];
}>();

const columns: TableColumn<OrderItemListItem>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }: TableRow<OrderItemListItem>) =>
      h("div", { class: "flex flex-col" }, row.getValue("product_name")),
  },
  {
    accessorKey: "product_price",
    header: "Base Price",
    cell: ({ row }: TableRow<OrderItemListItem>) =>
      h("div", { class: "flex flex-col" }, row.getValue("product_price")),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }: TableRow<OrderItemListItem>) =>
      h("div", { class: "flex flex-col" }, row.getValue("quantity")),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }: TableRow<OrderItemListItem>) =>
      h("div", { class: "flex flex-col" }, row.getValue("total")),
  },
];
</script>
