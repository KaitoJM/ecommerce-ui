<template>
  <UPagination
    v-model:page="pageMeta.current_page"
    :to="to"
    :total="pageMeta.total"
    @update:page="handleUpdatePage"
  />
</template>

<script setup lang="ts">
export interface ArrowLink {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
  page: number | null;
}

export interface PageMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: Link[];
}

const props = defineProps<{
  pageMeta: PageMeta;
  links: ArrowLink;
  query?: string;
}>();

function to(page: number) {
  return {
    query: {
      page,
    },
    hash: props.query || "",
  };
}

const emit = defineEmits<{
  (e: "update:page", page: number): void;
}>();

const handleUpdatePage = (page: number) => {
  emit("update:page", page);
};
</script>
