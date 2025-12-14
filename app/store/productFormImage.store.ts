import type { FetchError } from "ofetch";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { ProductImage } from "~/types/Product.types";

const config = useRuntimeConfig();

export const useProductFormImageStore = defineStore(
  "productFormImageStore",
  () => {
    const productImages = ref<ProductImage[]>([]);

    const getProductImages = async (id: string): Promise<ProductImage[]> => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(`Failed to get product images.`, "No auth token found");
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      try {
        const response: ApiSuccess<ProductImage[]> = await $fetch(
          `${config.public.apiBase}/product-images`,
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

        productImages.value = response.data;
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

        console.error(`Failed to fetch product images:`, error);
        throw apiError;
      }
    };

    const uploadImage = async (productID: string, file: File) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to upload product image: ${file.name}`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("product_id", productID);
      formData.append("cover", "0");

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: formData,
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

        console.error(`Failed to upload product image:`, error);
        throw apiError;
      }
    };

    const settingCover = ref<string | null>(null);
    const setCover = async (id: string, productId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to change product cover image: ${id}`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      settingCover.value = id;

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-images-cover/${id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        settingCover.value = null;
        getProductImages(productId);
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

        console.error(`Failed to change product cover image: ${id}`, error);
        throw apiError;
      }
    };

    const deletingImage = ref<string | null>(null);
    const deleteImage = async (id: string, productId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          `Failed to delete product image: ${id}`,
          "No auth token found"
        );
        throw {
          message: "Authentication required. Please log in again.",
          statusCode: 401,
        } satisfies ApiError;
      }

      deletingImage.value = id;

      try {
        const response = await $fetch(
          `${config.public.apiBase}/product-images/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        deletingImage.value = null;
        getProductImages(productId);
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

        console.error(`Failed to delete product image: ${id}`, error);
        throw apiError;
      }
    };

    return {
      productImages,
      getProductImages,
      uploadImage,
      settingCover,
      setCover,
      deletingImage,
      deleteImage,
    };
  }
);
