import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type {
  ApiError,
  ApiPaginated,
  ApiSuccess,
} from "~/types/ApiResponses.types";
import type { Attribute, AttributeSelection } from "~/types/Attribute.types";

const config = useRuntimeConfig();

export interface AttributeForm {
  attribute: string;
  selection_type: AttributeSelection;
}

export const useAttributeStore = defineStore("attributeStore", () => {
  const pageMeta = ref<PageMeta>({
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0,
    links: [
      {
        url: null,
        label: "",
        active: false,
        page: 1,
      },
    ],
  });

  const links = ref<ArrowLink>({
    first: null,
    last: null,
    prev: null,
    next: null,
  });

  const fetching = ref<boolean>(false);
  const attributes = ref<Attribute[]>([]);

  const attributeList = computed(() => {
    if (!attributes.value || attributes.value.length === 0) {
      return [];
    }

    console.log("Mapping attributed to attributeList:", attributes.value);

    return attributes.value.map((attribute) => ({
      id: attribute.id,
      selection_type: attribute.selection_type,
      attribute: attribute.attribute,
      created_at: attribute.created_at,
    }));
  });

  const getAttributes = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Attribute>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch attributes`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

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
      const res: ApiPaginated<Attribute> = await $fetch(
        `${config.public.apiBase}/attributes${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      attributes.value = res.data;
      pageMeta.value = res.meta;
      fetching.value = false;
      links.value = res.links;

      return res;
    } catch (error) {
      fetching.value = false;
      const fetchError = error as FetchError<any>;

      const apiError: ApiError = {
        message:
          fetchError.data?.message ??
          fetchError.message ??
          "Something went wrong",
        errors: fetchError.data?.errors,
        statusCode: fetchError.status,
      };

      console.error(`Failed to fetch attributes:`, error);
      throw apiError;
    }
  };

  const storeAttribute = async (params: AttributeForm) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new attribute`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<Attribute> = await $fetch(
        `${config.public.apiBase}/attributes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      attributes.value.push(response.data);
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

      console.error(`Failed to create new attribute`, error);
      throw apiError;
    }
  };

  const updateAttribute = async (
    attributeId: string,
    params: { attribute: string; selection_type: string }
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to update attribute with ID ${attributeId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/attributes/${attributeId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: params,
      });
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
        `Failed to update attribute with ID ${attributeId}:`,
        error
      );
      throw apiError;
    }
  };

  const deleteAttribute = async (attributeId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete attribute with ID ${attributeId}:`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/attributes/${attributeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted attribute from the attributes array
      attributes.value = attributes.value.filter(
        (attribute) => attribute.id !== attributeId
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
        `Failed to delete attribute with ID ${attributeId}:`,
        error
      );
      throw apiError;
    }
  };

  return {
    attributes,
    fetching,
    attributeList,
    pageMeta,
    links,
    getAttributes,
    storeAttribute,
    updateAttribute,
    deleteAttribute,
  };
});
