<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-col md:flex-row gap-2 justify-between md:items-center"
    >
      <slot name="headerLeft"></slot>
      <div class="flex items-center gap-2">
        <UFieldGroup>
          <UButton
            color="neutral"
            variant="outline"
            label="Selected Options"
            icon="i-lucide-list-checks"
            :disabled="
              !table?.tableApi?.getFilteredSelectedRowModel().rows.length
            "
          />
          <UDropdownMenu
            :items="SelectedOptionItems"
            :disabled="
              !table?.tableApi?.getFilteredSelectedRowModel().rows.length
            "
          >
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
        </UFieldGroup>
        <slot name="headerAction"></slot>
      </div>
    </div>
    <UTable
      ref="table"
      sticky
      v-model:row-selection="rowSelection"
      :data="data"
      :columns="columns"
      :loading="loading"
      loading-color="primary"
      loading-animation="carousel"
    />

    <div
      class="flex justify-between items-center gap-4 border-t border-accented px-4 py-3.5"
    >
      <div class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
        selected.
      </div>
      <PaginationVue
        :page-meta="pageMeta"
        :links="pageLinks"
        :query="query"
        @update:page="handleUpdatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui/runtime/components/DropdownMenu.vue.js";
import PaginationVue, { type ArrowLink } from "./Pagination.vue";
import type { PageMeta } from "./Pagination.vue";
import { ref } from "vue";
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";

const props = defineProps<{
  data: Array<any>;
  columns: Array<any>;
  pageMeta: PageMeta;
  pageLinks: ArrowLink;
  query?: string;
  loading?: boolean;
}>();

const table = useTemplateRef("table");
const rowSelection = ref({});

const selectedRowsId = computed<string[]>(() => {
  return table.value?.tableApi
    ?.getFilteredSelectedRowModel()
    .rows.map((row: { original: { id: string } }) =>
      row.original.id.toString()
    ) as string[];
});

const SelectedOptionItems: DropdownMenuItem[] = [
  {
    label: "Delete",
    icon: "i-lucide-trash",
    color: "error",
    onClick: () => handleDeleteSelected(),
  },
];

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "delete:multiple", ids: string[]): void;
}>();

//deletion
const overlay = useOverlay();
const deleteModel = overlay.create(ConfirmationDialog);

const handleDeleteSelected = () => {
  deleteModel.open({
    title: "Delete Selected Records",
    message: "Are you sure you want to delete these records?",
    submessage: "Deleting records might also delete related data.",
    onOk: () => {
      if (selectedRowsId.value.length === 0) return;
      emit("delete:multiple", selectedRowsId.value);
    },
  });
};

const handleUpdatePage = (page: number) => {
  emit("update:page", page);
};
</script>
