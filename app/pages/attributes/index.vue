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
          class="w-80"
          size="md"
          variant="outline"
          placeholder="Search attributes..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal>
          <UButton variant="outline" color="primary" icon="i-lucide-plus">
            Add Attribute
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
import { onMounted, ref } from "vue";
import type { TableRow } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";
import { useAttributeStore } from "~/store/attribute.store";
import type { AttributeListItem } from "~/types/Attribute.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const attributeStore = useAttributeStore();
const UCheckbox = resolveComponent("UCheckbox");
const router = useRouter();

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

// table columns
const columns: TableColumn<AttributeListItem>[] = [
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
      h("div", {}, row.getValue("selection_type")),
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

const handleViewDetails = (attributeId: string) => {
  console.log("View details for attribute ID:", attributeId);
};

const handleEditAttribute = (attributeId: string) => {
  console.log("Edit attribute ID:", attributeId);
  router.push(`/attributes/manage/${attributeId}`);
};

const handleDuplicateAttribute = (attributeId: string) => {
  console.log("Duplicate attributes ID:", attributeId);
};

const handleDeleteAttribute = (attributeId: string) => {
  console.log("Delete attributes ID:", attributeId);
};

const handlePageUpdate = (page: number) => {
  attributeStore.getAttributes({ page: page });
};

const handleDeleteAttributeMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete attribute ID:", id);
    await attributeStore.deleteAttribute(id);
  });
};
</script>
