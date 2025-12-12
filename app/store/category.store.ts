import { page } from "#build/ui";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type { Category } from "~/types/Category.types";

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
  ) => {
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
      const res: ApiResponseCategories = await $fetch(
        `${config.public.apiBase}/categories${pageQuery}`
      );

      categories.value = res.data;
      pageMeta.value = res.meta;
      fetching.value = false;
      links.value = res.links;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      fetching.value = false;
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
      console.error(`Failed to delete category with ID ${categoryId}:`, error);
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
