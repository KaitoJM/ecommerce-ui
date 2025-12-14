import type { FetchError } from "ofetch";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { ProductAttribute } from "~/types/Product.types";

const config = useRuntimeConfig();

export interface ProductAttributeForm {
  product_id: string;
  attribute_id: string;
  value: string;
  color_value?: string;
}

export const useProductFormAttributeStore = defineStore(
  "productFormAttributeStore",
  () => {
    const productAttributes = ref<ProductAttribute[]>([]);

    const getProductAttributes = async (
      id: string
    ): Promise<ProductAttribute[]> => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to get product attributes.`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response: ApiSuccess<ProductAttribute[]> = await $fetch(
          `${config.public.apiBase}/product-attributes`,
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

        productAttributes.value = response.data;
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

        console.error(`Failed to fetch product attributes:`, error);
        throw apiError;
      }
    };

    const adding = ref<boolean>(false);
    const createProductAttribute = async (
      params: ProductAttributeForm
    ): Promise<ProductAttribute> => {
      const token = localStorage.getItem("token");
      adding.value = true;

      if (!token) {
        console.error(
          `Failed to get product attributes.`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response: ApiSuccess<ProductAttribute> = await $fetch(
          `${config.public.apiBase}/product-attributes`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: params,
          }
        );

        adding.value = false;
        getProductAttributes(params.product_id);
        return response.data;
      } catch (error) {
        adding.value = false;
        const fetchError = error as FetchError<any>;

        const apiError: ApiError = {
          message:
            fetchError.data?.message ??
            fetchError.message ??
            "Something went wrong",
          errors: fetchError.data?.errors,
          statusCode: fetchError.status,
        };

        console.error(`Failed to create new product attribute:`, error);
        throw apiError;
      }
    };

    return {
      productAttributes,
      getProductAttributes,
      adding,
      createProductAttribute,
    };
  }
);
