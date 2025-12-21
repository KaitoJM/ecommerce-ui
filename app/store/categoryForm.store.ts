import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Category } from "~/types/Category.types";

export interface CategoryInformationForm {
  id: string;
  name: string;
  description: string;
}

const config = useRuntimeConfig();

export const useCategoryFormStore = defineStore("categoryFormStore", () => {
  const category = ref<Category | null>(null);
  const categoryInformation = ref<CategoryInformationForm>({
    id: "",
    name: "",
    description: "",
  });

  const getCategory = async (id: string): Promise<Category> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to fetch category information`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const res: ApiSuccess<Category> = await $fetch(
        `${config.public.apiBase}/categories/${id}`
      );

      category.value = res.data;

      //category information
      categoryInformation.value = {
        id: category.value.id,
        name: category.value.name,
        description: category.value.description,
      };

      return res.data;
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

      console.error("Failed to fetch category information:", error);
      throw apiError;
    }
  };

  return {
    category,
    categoryInformation,
    getCategory,
  };
});
