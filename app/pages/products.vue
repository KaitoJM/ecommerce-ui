<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-4">
      <TotalProductsVue />
      <TotalPublishedProductsVue />
      <NewProductsAdded30daysVue />
      <OutOfStockProductsVue />
    </div>
    <RecordListVue
      class="mt-4"
      :data="productStore.productList"
      :columns="columns"
      :pageMeta="productStore.pageMeta"
      :pageLinks="productStore.links"
      :loading="productStore.fetching"
      @update:page="handlePageUpdate"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-80"
          size="md"
          variant="outline"
          placeholder="Search products..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UButton variant="outline" color="primary" icon="i-lucide-plus">
          Add Product
        </UButton>
      </template>
    </RecordListVue>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import RecordListVue from "~/components/ui/RecordList.vue";
import TotalProductsVue from "~/components/dashboard/TotalProducts.vue";
import TotalPublishedProductsVue from "~/components/dashboard/TotalPublishedProducts.vue";
import NewProductsAdded30daysVue from "~/components/dashboard/NewProductsAdded30days.vue";
import OutOfStockProductsVue from "~/components/dashboard/OutOfStockProducts.vue";
import type { ProductListItem } from "~/types/Product.types";
import { useProductStore } from "~/store/product.store";
import { onMounted, ref } from "vue";
import type { TableRow } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";

definePageMeta({
  layout: "main-template",
});

const productStore = useProductStore();
const UCheckbox = resolveComponent("UCheckbox");
const UBadge = resolveComponent("UBadge");
const router = useRouter();

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  productStore.getProducts({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  productStore.getProducts({ page: routeQueryPage.value }, searchKeyword.value);
}, 400);

// table columns
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
    cell: ({ row }: TableRow<ProductListItem>) =>
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
    cell: ({ row }: TableRow<ProductListItem>) => {
      const categories: string[] = row.original.categories;
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
    cell: ({ row }: TableRow<ProductListItem>) => {
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
    cell: ({ row }: TableRow<ProductListItem>) => {
      const amount = Number.parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    cell: ({ row }: TableRow<ProductListItem>) => {
      return new Date(row.getValue("created_at")).toLocaleString("en-US", {
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
    cell: ({ row }: TableRow<ProductListItem>) =>
      h("div", { class: "text-right" }, row.getValue("stock")),
  },
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "Action"),
    cell: ({ row }: TableRow<ProductListItem>) => {
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

      return h(
        "div",
        { class: "text-right" },
        h(UFieldGroup, {}, [
          h(
            UButton,
            {
              color: "primary",
              onClick: () => {
                handleViewDetails(id);
              },
            },
            () => "Details"
          ),
          h(UDropdownMenu, { items: items }, [
            h(UButton, {
              color: "primary",
              icon: "i-lucide-chevron-down",
            }),
          ]),
        ])
      );
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

const handlePageUpdate = (page: number) => {
  productStore.getProducts({ page: page });
};
</script>
