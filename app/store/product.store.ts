import type { Product } from "~/types/Product.types";

type ApiResponseProduct = {
  data: Product[];
};

const config = useRuntimeConfig();

export const useProductStore = defineStore("productStore", () => {
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
      thumbnail: "",
      published: product.published ? true : false,
      price: product.specification.price,
      sku: "",
      stock: product.specification.stock,
      categories: product.categories.map((cat) => cat.name),
      createdAt: product.created_at,
    }));
  });

  const getProducts = async () => {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   products.value = [];
    //   return;
    // }

    try {
      const res: ApiResponseProduct = await $fetch(
        `${config.public.apiBase}/products`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      products.value = res.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      products.value = [];
    }
  };

  return {
    products,
    productList,
    getProducts,
  };
});
