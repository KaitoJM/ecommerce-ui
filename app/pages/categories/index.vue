<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-4">
      <TotalCategories />
      <TotalUnusedCategories />
    </div>
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
        <UModal v-model:open="showAddCategoryModal">
          <UButton
            variant="outline"
            color="primary"
            icon="i-lucide-plus"
            @click="showAddCategoryModal = true"
          >
            Add Category
          </UButton>
          <template #content>
            <CategoryCreationForm @done="showAddCategoryModal = false" />
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
import CategoryCreationForm from "~/components/forms/category/CategoryCreationForm.vue";
import type { ApiError } from "~/types/ApiResponses.types";
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import TotalCategories from "~/components/dashboard/TotalCategories.vue";
import TotalUnusedCategories from "~/components/dashboard/TotalUnusedCategories.vue";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const categoryStore = useCategoryStore();
const router = useRouter();

const showAddCategoryModal = ref<boolean>(false);

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

const UCheckbox = resolveComponent("UCheckbox");
const UFieldGroup = resolveComponent("UFieldGroup");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const columns: TableColumn<CategoryListItem>[] = [
  {
    id: "select",
    header: ({
      table,
    }: {
      table: {
        getIsSomePageRowsSelected: any;
        getIsAllPageRowsSelected: any;
        toggleAllPageRowsSelected: any;
      };
    }) =>
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
        h(
          UFieldGroup,
          {},
          {
            default: () => [
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
              h(
                UDropdownMenu,
                { items: items },
                {
                  default: () => [
                    h(UButton, {
                      color: "primary",
                      icon: "i-lucide-chevron-down",
                    }),
                  ],
                }
              ),
            ],
          }
        )
      );
    },
  },
];

const toast = useToast();
const overlay = useOverlay();
const deleteCategoryModal = overlay.create(ConfirmationDialog);

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
  deleteCategoryModal.open({
    title: "Delete Category",
    message: "Are you sure you want to delete this category?",
    onOk: () => {
      deleteCategory(categoryId);
    },
  });
};

const handlePageUpdate = (page: number) => {
  categoryStore.getCategories({ page: page });
};

const deleteCategory = async (id: string) => {
  try {
    await categoryStore.deleteCategory(id);
    toast.add({
      title: "Deleted",
      description: "Items has bees successfully deleted.",
      color: "success",
      icon: "i-lucide-check",
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
  }
};

const handleDeleteCategoryMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete category ID:", id);
    await categoryStore.deleteCategory(id);
  });
};
</script>
