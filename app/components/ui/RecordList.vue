<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <UInput
        icon="i-lucide-search"
        class="w-80"
        size="md"
        variant="outline"
        placeholder="Search products..."
      />
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
    />

    <div
      class="flex justify-between items-center gap-4 border-t border-accented px-4 py-3.5"
    >
      <div class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
        selected.
      </div>
      <UPagination v-model:page="page" :total="100" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Array<any>;
  columns: Array<any>;
}>();

const page = ref(5);
const table = useTemplateRef("table");
const rowSelection = ref({ 1: true });

const SelectedOptionItems: DropdownMenuItem[] = [
  {
    label: "Delete",
    icon: "i-lucide-trash",
    color: "error",
    onClick: () => handleDeleteSelected(),
  },
];

const handleDeleteSelected = () => {
  const selectedRows = table.value?.tableApi?.getSelectedRowModel().rows;
  console.log("Deleting rows: ", selectedRows);
};
</script>
