import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export type ApiPaginated<T> = {
  data: T[];
  meta: PageMeta;
  links: ArrowLink;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};
