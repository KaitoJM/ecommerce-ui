import type { FetchError } from "ofetch";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
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

export interface ProductCreation {
  name: string;
  summary: string;
}

const config = useRuntimeConfig();

export const useProductFormStore = defineStore("productFormStore", () => {
  const product = ref<Product | null>(null);
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

      product.value = res;
      loadingProduct.value = false;

      //product information
      productInformation.value = {
        id: product.value.id,
        name: product.value.name,
        summary: product.value.summary,
        description: product.value.description,
        categories: product.value.categories,
        price: product.value.specification.price,
        stock: product.value.specification.stock,
        published: product.value.published ? true : false,
      };
    } catch (error) {
      console.error("Failed to fetch product information:", error);
      loadingProduct.value = false;
    }
  };

  const createProduct = async (params: ProductCreation): Promise<Product> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new product.`, "No auth token found");
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<Product> = await $fetch(
        `${config.public.apiBase}/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      return response.data;
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

      console.error(`Failed to create new product.:`, error);
      throw apiError;
    }
  };

  return {
    product,
    loadingProduct,
    productInformation,
    getProduct,
    createProduct,
  };
});
