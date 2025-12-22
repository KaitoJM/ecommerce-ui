import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Attribute, AttributeSelection } from "~/types/Attribute.types";

export interface AttributeInformationForm {
  id: string;
  attribute: string;
  selection_type: AttributeSelection;
}

const config = useRuntimeConfig();

export const useAttributeFormStore = defineStore("attributeFormStore", () => {
  const attribute = ref<Attribute | null>(null);
  const attributeInformation = ref<AttributeInformationForm>({
    id: "",
    attribute: "",
    selection_type: "dropdown",
  });

  const getAttribute = async (id: string): Promise<Attribute> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to fetch attribute information`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const res: ApiSuccess<Attribute> = await $fetch(
        `${config.public.apiBase}/attributes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      attribute.value = res.data;

      //attribute information
      attributeInformation.value = {
        id: attribute.value.id,
        attribute: attribute.value.attribute,
        selection_type: attribute.value.selection_type,
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

      console.error("Failed to fetch attribute information:", error);
      throw apiError;
    }
  };

  return {
    attribute,
    attributeInformation,
    getAttribute,
  };
});
