import type { FetchError } from "ofetch";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Combination, ProductSpecification } from "~/types/Product.types";

const config = useRuntimeConfig();

export interface ProductSpecificationForm {
  combination: string;
  product_id: string;
  price: number;
  stock: number;
  default: boolean;
  sale?: boolean;
  sale_price?: number;
  images: string;
}

interface ProductSpecificationRaw {
  id: string;
  combination: string;
  product_id: string;
  price: number;
  stock: number;
  default: string;
  sale: boolean;
  sale_price?: number;
  created_at: string;
  images: string;
}

export const useProductSpecificationStore = defineStore(
  "productSpecificationStore",
  () => {
    const productSpecifications = ref<ProductSpecification[]>([]);

    const getProductSpecifications = async (
      producy_id: string
    ): Promise<ProductSpecification[]> => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to get product specifications.`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response: ApiSuccess<ProductSpecificationRaw[]> = await $fetch(
          `${config.public.apiBase}/product-specifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            query: {
              product_id: producy_id,
            },
          }
        );

        productSpecifications.value = response.data.map((item) => ({
          ...item,
          combination: JSON.parse(item.combination),
          default: item.default == "1" ? true : false,
          images: item.images ? JSON.parse(item.images) : [],
        }));
        return productSpecifications.value;
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

        console.error(`Failed to fetch product specifications:`, error);
        throw apiError;
      }
    };

    const clearProductSpecification = () => {
      productSpecifications.value = [];
    };

    const setNewProductSpecificationsSet = (
      specifications: ProductSpecification[]
    ) => {
      productSpecifications.value = specifications;
    };

    const addProductSpecification = async (
      params: ProductSpecificationForm
    ) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to create product specification`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-specifications`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: params,
          }
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

        console.error(`Failed to create product specification`, error);
        throw apiError;
      }
    };

    const deletingProductSpecification = ref<string | null>(null);
    const deleteProductSpecification = async (
      id: string,
      productId: string
    ) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to delete product specification: ${id}`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      deletingProductSpecification.value = id;

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-specifications/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        deletingProductSpecification.value = null;
        getProductSpecifications(productId);
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

        console.error(`Failed to delete product specification: ${id}`, error);
        throw apiError;
      }
    };

    const deleteProductSpecificationByProduct = async (productId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to delete product specification by product: ${productId}`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-specifications-delete-by-product/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
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

        console.error(
          `Failed to delete product specification by product: ${productId}`,
          error
        );
        throw apiError;
      }
    };

    return {
      productSpecifications,
      getProductSpecifications,
      clearProductSpecification,
      setNewProductSpecificationsSet,
      addProductSpecification,
      deletingProductSpecification,
      deleteProductSpecification,
      deleteProductSpecificationByProduct,
    };
  }
);
