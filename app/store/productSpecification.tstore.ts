import type { FetchError } from "ofetch";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Combination, ProductSpecification } from "~/types/Product.types";

const config = useRuntimeConfig();

export const useProductSpecificationStore = defineStore(
  "productSpecificationStore",
  () => {
    const productSpecifications = ref<ProductSpecification[]>([]);

    const getProductSpecifications = async (
      id: string
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
        const response: ApiSuccess<ProductSpecification[]> = await $fetch(
          `${config.public.apiBase}/product-specifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            query: {
              product_id: id,
            },
          }
        );

        productSpecifications.value = response.data;
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

        console.error(`Failed to fetch product specifications:`, error);
        throw apiError;
      }
    };

    const addProductSpecification = async (params: Combination) => {
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
          `${config.public.apiBase}/product-images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: {
              product_id: params.product_id,
              attributes: JSON.stringify(params.attributes),
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

    return {
      productSpecifications,
      getProductSpecifications,
      addProductSpecification,
      deletingProductSpecification,
      deleteProductSpecification,
    };
  }
);
