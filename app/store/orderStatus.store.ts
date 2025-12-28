import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type {
  ApiError,
  ApiPaginated,
  ApiSuccess,
} from "~/types/ApiResponses.types";
import { defineStore } from "pinia";
import type { OrderStatus } from "~/types/Order.types";

export interface OrderStatusForm {
  status: string;
  color_code: string;
  description: string;
}

const config = useRuntimeConfig();
export const useOrderStatusStore = defineStore("orderStatusStore", () => {
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
  const orderStatuses = ref<OrderStatus[]>([]);

  const getOrderStatuses = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<OrderStatus>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch order statuses:`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    fetching.value = true;

    let pageQuery = "";
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
      const res: ApiPaginated<OrderStatus> = await $fetch(
        `${config.public.apiBase}/order-statuses${pageQuery}`
      );

      orderStatuses.value = res.data;
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

      console.error(`Failed to fetch order statuses:`, error);
      throw apiError;
    }
  };

  const storeOrderStatus = async (params: OrderStatusForm) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new order status`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<OrderStatus> = await $fetch(
        `${config.public.apiBase}/order-statuses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      orderStatuses.value.push(response.data);
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

      console.error(`Failed to create new order status`, error);
      throw apiError;
    }
  };

  const updateOrderStatus = async (
    orderStatusId: string,
    params: OrderStatusForm
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to update order status with ID ${orderStatusId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/order-statuses/${orderStatusId}`, {
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
        `Failed to update order status with ID ${orderStatusId}:`,
        error
      );
      throw apiError;
    }
  };

  const deleteOrderStatus = async (orderStatusId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete order status with ID ${orderStatusId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/order-status/${orderStatusId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted order status from the orderStatuses array
      orderStatuses.value = orderStatuses.value.filter(
        (status) => status.id !== orderStatusId
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
        `Failed to delete order status with ID ${orderStatusId}:`,
        error
      );
      throw apiError;
    }
  };

  return {
    orderStatuses,
    fetching,
    pageMeta,
    links,
    getOrderStatuses,
    storeOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
  };
});
