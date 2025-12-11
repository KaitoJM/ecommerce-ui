import { page } from "#build/ui";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type { Product } from "~/types/Product.types";

type ApiResponseProduct = {
  data: Product[];
  meta: PageMeta;
  links: ArrowLink;
};

const config = useRuntimeConfig();

export const useProductStore = defineStore("productStore", () => {
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

  const pageMeta = ref<PageMeta>({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0,
    links: {
      url: null,
      label: "",
      active: false,
      page: 1,
    },
  });

  const links = ref<ArrowLink>({
    first: null,
    last: null,
    prev: null,
    next: null,
  });

  const getProducts = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ) => {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   products.value = [];
    //   return;
    // }
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
      const res: ApiResponseProduct = await $fetch(
        `${config.public.apiBase}/products${pageQuery}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
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

  return {
    products,
    fetching,
    productList,
    pageMeta,
    links,
    getProducts,
  };
});
