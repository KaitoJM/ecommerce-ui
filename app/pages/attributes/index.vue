<template>
  <div class="flex flex-col gap-2">
    <RecordListVue
      class="mt-4"
      :data="attributeStore.attributeList"
      :columns="columns"
      :pageMeta="attributeStore.pageMeta"
      :pageLinks="attributeStore.links"
      :loading="attributeStore.fetching"
      @update:page="handlePageUpdate"
      @delete:multiple="handleDeleteAttributeMultiple"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-full md:w-80"
          size="md"
          variant="outline"
          placeholder="Search attributes..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal v-model:open="showAddAttributeModal">
          <UButton
            variant="outline"
            color="primary"
            icon="i-lucide-plus"
            @click="showAddAttributeModal = true"
          >
            Add Attribute
          </UButton>
          <template #content>
            <AttributeCreationForm @done="showAddAttributeModal = false" />
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
import { useAttributeStore } from "~/store/attribute.store";
import type { AttributeListItem } from "~/types/Attribute.types";
import AttributeCreationForm from "~/components/forms/attribute/AttributeCreationForm.vue";
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import type { ApiError } from "~/types/ApiResponses.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const attributeStore = useAttributeStore();
const router = useRouter();

const showAddAttributeModal = ref<boolean>(false);

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  attributeStore.getAttributes({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  attributeStore.getAttributes(
    { page: routeQueryPage.value },
    searchKeyword.value
  );
}, 400);

const UCheckbox = resolveComponent("UCheckbox");
const UBadge = resolveComponent("UBadge");
const UFieldGroup = resolveComponent("UFieldGroup");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const columns: TableColumn<AttributeListItem>[] = [
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
    cell: ({ row }: TableRow<AttributeListItem>) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "attribute",
    header: "Attribute",
    cell: ({ row }: TableRow<AttributeListItem>) =>
      h("div", {}, row.getValue("attribute")),
  },
  {
    accessorKey: "selection_type",
    header: "Selection Type",
    cell: ({ row }: TableRow<AttributeListItem>) =>
      h(
        UBadge,
        { variant: "outline", color: "neutral" },
        row.getValue("selection_type")
      ),
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }: TableRow<AttributeListItem>) => {
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
    cell: ({ row }: TableRow<AttributeListItem>) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage attribute",
          icon: "i-lucide-settings",
          onClick: () => handleEditAttribute(id),
        },
        {
          label: "Duplicate attribute",
          icon: "i-lucide-copy",
          onClick: () => handleDuplicateAttribute(id),
        },
        {
          label: "Delete attribute",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteAttribute(id),
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

const handleViewDetails = (attributeId: string) => {
  console.log("View details for attribute ID:", attributeId);
};

const handleEditAttribute = (attributeId: string) => {
  console.log("Edit attribute ID:", attributeId);
  router.push(`/attributes/${attributeId}/manage`);
};

const handleDuplicateAttribute = (attributeId: string) => {
  console.log("Duplicate attributes ID:", attributeId);
};

const toast = useToast();
const overlay = useOverlay();
const deleteAttributeModal = overlay.create(ConfirmationDialog);

const handleDeleteAttribute = (attributeId: string) => {
  deleteAttributeModal.open({
    title: "Delete Attribute",
    message: "Are you sure you want to delete this attribute?",
    onOk: () => {
      deleteAttribute(attributeId);
    },
  });
};

const handlePageUpdate = (page: number) => {
  attributeStore.getAttributes({ page: page });
};

const deleteAttribute = async (id: string) => {
  try {
    await attributeStore.deleteAttribute(id);
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

const handleDeleteAttributeMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete attribute ID:", id);
    await attributeStore.deleteAttribute(id);
  });
};
</script>
