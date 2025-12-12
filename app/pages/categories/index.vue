<template>
  <div class="flex flex-col gap-2">
    <RecordListVue
      class="mt-4"
      :data="categoryStore.categoryList"
      :columns="columns"
      :pageMeta="categoryStore.pageMeta"
      :pageLinks="categoryStore.links"
      :loading="categoryStore.fetching"
      @update:page="handlePageUpdate"
      @delete:multiple="handleDeleteCategoryMultiple"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-80"
          size="md"
          variant="outline"
          placeholder="Search categories..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal>
          <UButton variant="outline" color="primary" icon="i-lucide-plus">
            Add Category
          </UButton>
          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate,
            culpa sed doloremque quisquam animi expedita architecto, magnam
            molestiae officiis ratione sunt esse eum. Corrupti dolores
            architecto quae atque, nulla commodi.
          </template>
        </UModal>
      </template>
    </RecordListVue>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import RecordListVue from "~/components/ui/RecordList.vue";
import type { CategoryListItem } from "~/types/Category.types";
import { onMounted, ref } from "vue";
import type { TableRow } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";
import { useCategoryStore } from "~/store/category.store";

definePageMeta({
  layout: "main-template",
});

const categoryStore = useCategoryStore();
const UCheckbox = resolveComponent("UCheckbox");
const router = useRouter();

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  categoryStore.getCategories({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  categoryStore.getCategories(
    { page: routeQueryPage.value },
    searchKeyword.value
  );
}, 400);

// table columns
const columns: TableColumn<CategoryListItem>[] = [
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
    cell: ({ row }: TableRow<CategoryListItem>) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }: TableRow<CategoryListItem>) =>
      h("div", {}, row.getValue("name")),
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }: TableRow<CategoryListItem>) => {
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
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "Action"),
    cell: ({ row }: TableRow<CategoryListItem>) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage category",
          icon: "i-lucide-settings",
          onClick: () => handleEditCategory(id),
        },
        {
          label: "Duplicate category",
          icon: "i-lucide-copy",
          onClick: () => handleDuplicateCategory(id),
        },
        {
          label: "Delete category",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteCategory(id),
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

const handleViewDetails = (categoryId: string) => {
  console.log("View details for category ID:", categoryId);
};

const handleEditCategory = (categoryId: string) => {
  console.log("Edit category ID:", categoryId);
  router.push(`/categories/manage/${categoryId}`);
};

const handleDuplicateCategory = (categoryId: string) => {
  console.log("Duplicate categories ID:", categoryId);
};

const handleDeleteCategory = (categoryId: string) => {
  console.log("Delete categories ID:", categoryId);
};

const handlePageUpdate = (page: number) => {
  categoryStore.getCategories({ page: page });
};

const handleDeleteCategoryMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete category ID:", id);
    await categoryStore.deleteCategory(id);
  });
};
</script>
