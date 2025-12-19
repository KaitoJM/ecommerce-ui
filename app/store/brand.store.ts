import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type {
  ApiError,
  ApiPaginated,
  ApiSuccess,
} from "~/types/ApiResponses.types";
import type { Brand } from "~/types/Brand.types";

const config = useRuntimeConfig();

export interface BrandForm {
  name: string;
  image: string;
}

export const useBrandStore = defineStore("brandStore", () => {
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
  const brands = ref<Brand[]>([]);

  const brandList = computed(() => {
    if (!brands.value || brands.value.length === 0) {
      return [];
    }

    return brands.value.map((brand) => ({
      id: brand.id,
      name: brand.name,
      image: brand.image,
      created_at: brand.created_at,
    }));
  });

  const getBrands = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Brand>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch brands`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

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
      const res: ApiPaginated<Brand> = await $fetch(
        `${config.public.apiBase}/brands${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      brands.value = res.data;
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

      console.error(`Failed to fetch brands:`, error);
      throw apiError;
    }
  };

  const storeBrand = async (params: BrandForm) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new brand`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<Brand> = await $fetch(
        `${config.public.apiBase}/brands`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      brands.value.push(response.data);
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

      console.error(`Failed to create new brand`, error);
      throw apiError;
    }
  };

  const deleteBrand = async (brandId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete brand with ID ${brandId}:`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/brands/${brandId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted category from the brands array
      brands.value = brands.value.filter((brand) => brand.id !== brandId);
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

      console.error(`Failed to delete brand with ID ${brandId}:`, error);
      throw apiError;
    }
  };

  return {
    brands,
    fetching,
    brandList,
    pageMeta,
    links,
    getBrands,
    storeBrand,
    deleteBrand,
  };
});
