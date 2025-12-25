import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type {
  ApiError,
  ApiPaginated,
  ApiSuccess,
} from "~/types/ApiResponses.types";
import type {
  Customer,
  CustomerListItem,
  Gender,
} from "~/types/Customer.types";
import type { User } from "~/types/User.types";

const config = useRuntimeConfig();

export interface UserForm {
  name: string;
  email: string;
}

export const useUserStore = defineStore("userStore", () => {
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
  const users = ref<User[]>([]);

  const getUsers = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<User>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch users`, "No auth token found");

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
      const res: ApiPaginated<User> = await $fetch(
        `${config.public.apiBase}/users${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      users.value = res.data;
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

      console.error(`Failed to fetch users:`, error);
      throw apiError;
    }
  };

  const storeUser = async (params: UserForm) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new user`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<User> = await $fetch(
        `${config.public.apiBase}/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      users.value.push(response.data);
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

      console.error(`Failed to create new user`, error);
      throw apiError;
    }
  };

  const updateUser = async (userId: string, params: UserForm) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to update user with ID ${userId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/users/${userId}`, {
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

      console.error(`Failed to update user with ID ${userId}:`, error);
      throw apiError;
    }
  };

  const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete user with ID ${userId}:`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted category from the users array
      users.value = users.value.filter((user) => user.id !== userId);
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

      console.error(`Failed to delete user with ID ${userId}:`, error);
      throw apiError;
    }
  };

  return {
    users,
    fetching,
    pageMeta,
    links,
    getUsers,
    storeUser,
    updateUser,
    deleteUser,
  };
});
