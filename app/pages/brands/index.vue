<template>
  <div class="flex flex-col gap-2">
    <RecordListVue
      class="mt-4"
      :data="brandStore.brandList"
      :columns="columns"
      :pageMeta="brandStore.pageMeta"
      :pageLinks="brandStore.links"
      :loading="brandStore.fetching"
      @update:page="handlePageUpdate"
      @delete:multiple="handleDeleteBrandMultiple"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-full md:w-80"
          size="md"
          variant="outline"
          placeholder="Search brands..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal v-model:open="showAddBrandModal">
          <UButton
            variant="outline"
            color="primary"
            icon="i-lucide-plus"
            @click="showAddBrandModal = true"
          >
            Add Brand
          </UButton>
          <template #content>
            <BrandCreationForm @done="showAddBrandModal = false" />
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
import { onMounted, ref } from "vue";
import type { TableRow } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import type { ApiError } from "~/types/ApiResponses.types";
import { useBrandStore } from "~/store/brand.store";
import type { BrandListItem } from "~/types/Brand.types";
import BrandCreationForm from "~/components/forms/brand/BrandCreationForm.vue";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const brandStore = useBrandStore();
const router = useRouter();

const showAddBrandModal = ref<boolean>(false);

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  brandStore.getBrands({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  brandStore.getBrands({ page: routeQueryPage.value }, searchKeyword.value);
}, 400);

const UCheckbox = resolveComponent("UCheckbox");
const UBadge = resolveComponent("UBadge");
const UFieldGroup = resolveComponent("UFieldGroup");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const columns: TableColumn<BrandListItem>[] = [
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
    cell: ({ row }: TableRow<BrandListItem>) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "name",
    header: "Brand Name",
    cell: ({ row }: TableRow<BrandListItem>) => {
      return h(
        "div",
        { class: "flex items-center gap-1" },
        {
          default: () => [
            h("img", {
              src: row.original.image,
              alt: row.getValue("name"),
              class:
                "w-8 h-8 object-contain bg-neutral-100 dark:bg-neutral-800 p-1 rounded mr-4",
            }),
            h("div", { class: "flex flex-col" }, [
              h("p", { class: "font-medium" }, row.getValue("name")),
            ]),
          ],
        }
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }: TableRow<BrandListItem>) => {
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
    cell: ({ row }: TableRow<BrandListItem>) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage brand",
          icon: "i-lucide-settings",
          onClick: () => handleEditBrand(id),
        },
        {
          label: "Duplicate brand",
          icon: "i-lucide-copy",
          onClick: () => handleDuplicateBrand(id),
        },
        {
          label: "Delete brand",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteBrand(id),
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

const handleViewDetails = (brandId: string) => {
  console.log("View details for brand ID:", brandId);
};

const handleEditBrand = (brandId: string) => {
  console.log("Edit brand ID:", brandId);
  router.push(`/brands/${brandId}/manage`);
};

const handleDuplicateBrand = (brandId: string) => {
  console.log("Duplicate brands ID:", brandId);
};

const toast = useToast();
const overlay = useOverlay();
const deleteBrandModal = overlay.create(ConfirmationDialog);

const handleDeleteBrand = (brandId: string) => {
  deleteBrandModal.open({
    title: "Delete Brand",
    message: "Are you sure you want to delete this brand?",
    onOk: () => {
      deleteBrand(brandId);
    },
  });
};

const handlePageUpdate = (page: number) => {
  brandStore.getBrands({ page: page });
};

const deleteBrand = async (id: string) => {
  try {
    await brandStore.deleteBrand(id);
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

const handleDeleteBrandMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete brand ID:", id);
    await brandStore.deleteBrand(id);
  });
};
</script>
