import type { Category } from "~/types/Category.types";
import type { Product } from "~/types/Product.types";

export interface ProductInformationForm {
  id: string;
  name: string;
  summary: string;
  description: string;
  categories: Category[];
  price: number;
  stock: number;
  published: boolean;
}

const config = useRuntimeConfig();

export const useProductFormStore = defineStore("productFormStore", () => {
  const selectedProduct = ref<Product | null>(null);
  const loadingProduct = ref<boolean>();
  const productInformation = ref<ProductInformationForm>({
    id: "",
    name: "",
    summary: "",
    description: "",
    categories: [],
    price: 0,
    stock: 0,
    published: false,
  });

  const getProduct = async (id: string) => {
    loadingProduct.value = true;
    try {
      const res: Product = await $fetch(
        `${config.public.apiBase}/products/${id}`
      );

      selectedProduct.value = res;
      loadingProduct.value = false;

      //product information
      productInformation.value = {
        id: selectedProduct.value.id,
        name: selectedProduct.value.name,
        summary: selectedProduct.value.summary,
        description: selectedProduct.value.description,
        categories: selectedProduct.value.categories,
        price: selectedProduct.value.specification.price,
        stock: selectedProduct.value.specification.stock,
        published: selectedProduct.value.published ? true : false,
      };
    } catch (error) {
      console.error("Failed to fetch product information:", error);
      loadingProduct.value = false;
    }
  };

  return {
    selectedProduct,
    loadingProduct,
    productInformation,
    getProduct,
  };
});
