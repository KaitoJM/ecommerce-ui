import type { FetchError } from "ofetch";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { PaginationParams } from "~/types/Global.types";
import type {
  ApiError,
  ApiPaginated,
  ApiSuccess,
} from "~/types/ApiResponses.types";
import type { Order } from "~/types/Order.types";

const config = useRuntimeConfig();

export interface OrderForm {
  customer_id: string;
  session_id: string;
  cart_id: string;
  status_id: string;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  total: string;
}

export const useOrderStore = defineStore("orderStore", () => {
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
  const orders = ref<Order[]>([]);

  const orderList = computed(() => orders.value);

  const getOrders = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Order>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch orders`, "No auth token found");

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
      const res: ApiPaginated<Order> = await $fetch(
        `${config.public.apiBase}/orders${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      orders.value = res.data;
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

      console.error(`Failed to fetch orders:`, error);
      throw apiError;
    }
  };

  const storeOrder = async (params: OrderForm): Promise<Order> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new order`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<Order> = await $fetch(
        `${config.public.apiBase}/orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      orders.value.push(response.data);
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

      console.error(`Failed to create new order`, error);
      throw apiError;
    }
  };

  const updateOrder = async (
    orderId: string,
    params: {
      customer_id: string;
      session_id: string;
      cart_id: string;
      status_id: string;
      subtotal: string;
      discount_total: string;
      tax_total: string;
      total: string;
    }
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to update order with ID ${orderId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/orders/${orderId}`, {
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

      console.error(`Failed to update order with ID ${orderId}:`, error);
      throw apiError;
    }
  };

  const deleteOrder = async (orderId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete order with ID ${orderId}:`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted category from the orders array
      orders.value = orders.value.filter((order) => order.id !== orderId);
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

      console.error(`Failed to delete order with ID ${orderId}:`, error);
      throw apiError;
    }
  };

  return {
    orders,
    fetching,
    orderList,
    pageMeta,
    links,
    getOrders,
    storeOrder,
    updateOrder,
    deleteOrder,
  };
});
