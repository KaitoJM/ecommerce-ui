import { page } from "#build/ui";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type { Product } from "~/types/Product.types";

type ApiResponseProducts = {
  data: Product[];
  meta: PageMeta;
  links: ArrowLink;
};

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
      price: product.specification.price,
      sku: "",
      stock: product.specification.stock,
      categories: product.categories.map((cat) => cat.name),
      created_at: product.created_at,
    }));
  });

  const getProducts = async (
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
      const res: ApiResponseProducts = await $fetch(
        `${config.public.apiBase}/products${pageQuery}`
      );

      products.value = res.data;
      pageMeta.value = res.meta;
      fetching.value = false;
      links.value = res.links;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      fetching.value = false;
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
      console.error(`Failed to delete product with ID ${productId}:`, error);
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
