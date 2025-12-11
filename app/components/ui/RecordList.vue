<template>
  <div>
    <UTable
      ref="table"
      sticky
      v-model:row-selection="rowSelection"
      :data="data"
      :columns="columns"
    />

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
      selected.
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Array<any>;
  columns: Array<any>;
}>();

const table = useTemplateRef("table");
const rowSelection = ref({ 1: true });
</script>
