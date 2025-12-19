import { page } from "#build/ui";
import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { ApiError, ApiPaginated } from "~/types/ApiResponses.types";
import type { PaginationParams } from "~/types/Global.types";
import type { Product } from "~/types/Product.types";

const config = useRuntimeConfig();

export const useProductStore = defineStore("productStore", () => {
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
  const products = ref<Product[]>([]);

  const productList = computed(() => {
    if (!products.value || products.value.length === 0) {
      return [];
    }

    console.log("Mapping products to productList:", products.value);

    return products.value.map((product) => ({
      id: product.id,
      name: product.name,
      summary: product.summary,
      thumbnail: product.thumbnail,
      published: product.published ? true : false,
      price: product?.specification?.price ?? "",
      sku: "",
      stock: product?.specification?.stock ?? "",
      brand: product.brand ?? null,
      categories: product.categories.map((cat) => cat.name),
      created_at: product.created_at,
    }));
  });

  const getProducts = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Product>> => {
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
      const res: ApiPaginated<Product> = await $fetch(
        `${config.public.apiBase}/products${pageQuery}`
      );

      products.value = res.data;
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

      console.error(`Failed to fetch products:`, error);
      throw apiError;
    }
  };

  const deleteProduct = async (productId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete product with ID ${productId}:`,
        "No auth token found"
      );
      return;
    }

    try {
      await $fetch(`${config.public.apiBase}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted product from the products array
      products.value = products.value.filter(
        (product) => product.id !== productId
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

      console.error(`Failed to delete product with ID ${productId}:`, error);
      throw apiError;
    }
  };

  return {
    products,
    fetching,
    productList,
    pageMeta,
    links,
    getProducts,
    deleteProduct,
  };
});
