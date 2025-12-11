<template>
  <div class="flex flex-col gap-2">
    <UAlert
      color="neutral"
      variant="subtle"
      title="Heads up!"
      description="You can change the primary color in your app config."
      icon="i-lucide-terminal"
    />
    <RecordListVue :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import RecordListVue from "~/components/ui/RecordList.vue";
import type { ProductListItem } from "~/types/Product.types";

definePageMeta({
  layout: "main-template",
});

const UCheckbox = resolveComponent("UCheckbox");
const UBadge = resolveComponent("UBadge");

const data = ref<ProductListItem[]>([
  {
    id: "4600",
    name: "iPhone 13 Pro",
    summary: "The latest iPhone with advanced features.",
    thumbnail:
      "https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/1801c418208f9607a371e61f8d9184d9/1/7/177270_2020.jpg",
    published: true,
    stock: 25,
    price: 999.99,
    category: ["Electronics", "Mobile Phones"],
    sku: "IP13PRO-256GB-BLU",
    createdAt: "2023-10-01T10:15:30Z",
  },
  {
    id: "4601",
    name: "Samsung Galaxy S21",
    summary: "High-end Android smartphone with great performance.",
    thumbnail:
      "https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/1801c418208f9607a371e61f8d9184d9/1/7/174359_2020_5.jpg",
    published: true,
    stock: 40,
    price: 799.99,
    category: ["Electronics", "Mobile Phones"],
    sku: "SGS21-128GB-GRY",
    createdAt: "2023-09-15T14:20:00Z",
  },
  {
    id: "4602",
    name: "Sony WH-1000XM4",
    summary: "Industry-leading noise canceling headphones.",
    thumbnail:
      "https://www.sony.com.ph/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
    published: false,
    stock: 15,
    price: 349.99,
    category: ["Electronics", "Audio"],
    sku: "SONY-WH1000XM4-BLK",
    createdAt: "2023-08-25T09:00:00Z",
  },
  {
    id: "4603",
    name: "Dell XPS 13 Laptop",
    summary: "Compact and powerful laptop for professionals.",
    thumbnail:
      "https://benson.ph/cdn/shop/products/xs9320nt-xnb-shot-5-1-sl_17736ffe-5f73-4b36-ac0c-c7797b735c91.jpg?v=1674270544",
    published: true,
    stock: 10,
    price: 1199.99,
    category: ["Electronics", "Computers"],
    sku: "DELL-XPS13-16GB-512GB",
    createdAt: "2023-07-30T11:45:00Z",
  },
]);

const columns: TableColumn<ProductListItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      const categories: string[] = row.original.category;
      return h("div", { class: "flex items-center gap-1" }, [
        h("img", {
          src: row.original.thumbnail,
          alt: row.getValue("name"),
          class: "w-10 h-10 object-cover rounded mr-4 mb-2",
        }),
        h("div", { class: "flex flex-col" }, [
          h("p", { class: "font-medium" }, row.getValue("name")),
          h("p", { class: "text-sm text-gray-500" }, row.original.summary),
          h(
            "div",
            { class: "flex flex-wrap gap-1 mt-1" },
            categories.map((cat) =>
              h(
                UBadge,
                {
                  class: "rounded-full",
                  key: cat,
                  variant: "subtle",
                  color: "neutral",
                  size: "xs",
                },
                () => cat
              )
            )
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("published") ? "published" : "draft";

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color: row.getValue("published") ? "success" : "neutral",
        },
        () => status
      );
    },
  },
  {
    accessorKey: "price",
    header: "Declared Price",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "stock",
    header: () => h("div", { class: "text-right" }, "Stock"),
    cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("stock")),
  },
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "Action"),
    cell: ({ row }) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage product",
          icon: "i-lucide-settings",
          onClick: () => handleEditProduct(id),
        },
        {
          label: "Duplicate product",
          icon: "i-lucide-copy",
          onClick: () => handleDuplicateProduct(id),
        },
        {
          label: "Delete product",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteProduct(id),
        },
      ];

      return h(UFieldGroup, {}, [
        h(
          UButton,
          {
            size: "sm",
            variant: "outline",
            color: "primary",
            onClick: () => {
              handleViewDetails(id);
            },
          },
          () => "Details"
        ),
        h(UDropdownMenu, { items: items }, [
          h(UButton, {
            size: "sm",
            variant: "outline",
            color: "primary",
            icon: "i-lucide-chevron-down",
          }),
        ]),
      ]);
    },
  },
];

const handleViewDetails = (productId: string) => {
  console.log("View details for product ID:", productId);
};

const handleEditProduct = (productId: string) => {
  console.log("Edit product ID:", productId);
};

const handleDuplicateProduct = (productId: string) => {
  console.log("Duplicate product ID:", productId);
};

const handleDeleteProduct = (productId: string) => {
  console.log("Delete product ID:", productId);
};
</script>
