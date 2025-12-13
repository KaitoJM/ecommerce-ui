import { page } from "#build/ui";
import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type { Category } from "~/types/Category.types";
import type { ApiError, ApiPaginated } from "~/types/ApiResponses.types";

type ApiResponseCategories = {
  data: Category[];
  meta: PageMeta;
  links: ArrowLink;
};

const config = useRuntimeConfig();

export const useCategoryStore = defineStore("caegoryStore", () => {
  const pageMeta = ref<PageMeta>({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0,
    links: [
      {
        url: null,
        label: "",
        active: false,
        page: 1,
      },
    ],
  });

  const links = ref<ArrowLink>({
    first: null,
    last: null,
    prev: null,
    next: null,
  });

  const fetching = ref<boolean>(false);
  const categories = ref<Category[]>([]);

  const categoryList = computed(() => {
    if (!categories.value || categories.value.length === 0) {
      return [];
    }

    console.log("Mapping categories to categoryList:", categories.value);

    return categories.value.map((category) => ({
      id: category.id,
      name: category.name,
      created_at: category.created_at,
    }));
  });

  const getCategories = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Category>> => {
    fetching.value = true;

    let pageQuery;
    if (paginationParams) {
      pageQuery = `?page=${paginationParams.page}`;
      if (paginationParams.per_page) {
        pageQuery += `&per_page=${paginationParams.per_page}`;
      }
    }

    if (searchKey) {
      pageQuery += pageQuery ? `&search=${searchKey}` : `?search=${searchKey}`;
    }

    try {
      const res: ApiPaginated<Category> = await $fetch(
        `${config.public.apiBase}/categories${pageQuery}`
      );

      categories.value = res.data;
      pageMeta.value = res.meta;
      fetching.value = false;
      links.value = res.links;

      return res;
    } catch (error) {
      fetching.value = false;
      const fetchError = error as FetchError<any>;

      const apiError: ApiError = {
        message:
          fetchError.data?.message ??
          fetchError.message ??
          "Something went wrong",
        errors: fetchError.data?.errors,
        statusCode: fetchError.status,
      };

      console.error(`Failed to fetch categories:`, error);
      throw apiError;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete category with ID ${categoryId}:`,
        "No auth token found"
      );
      return;
    }

    try {
      await $fetch(`${config.public.apiBase}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted category from the categories array
      categories.value = categories.value.filter(
        (category) => category.id !== categoryId
      );
    } catch (error) {
      const fetchError = error as FetchError<any>;

      const apiError: ApiError = {
        message:
          fetchError.data?.message ??
          fetchError.message ??
          "Something went wrong",
        errors: fetchError.data?.errors,
        statusCode: fetchError.status,
      };

      console.error(`Failed to delete category with ID ${categoryId}:`, error);
      throw apiError;
    }
  };

  return {
    categories,
    fetching,
    categoryList,
    pageMeta,
    links,
    getCategories,
    deleteCategory,
  };
});
