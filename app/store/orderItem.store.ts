import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ArrowLink, PageMeta } from "~/components/ui/Pagination.vue";
import type { ApiError, ApiPaginated } from "~/types/ApiResponses.types";
import type { PaginationParams } from "~/types/Global.types";
import type { OrderItem, OrderItemListItem } from "~/types/Order.types";
import type { Combination } from "~/types/Product.types";

const config = useRuntimeConfig();

export const useOrderItemStore = defineStore("orderItemStore", () => {
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
  const orderItems = ref<OrderItem[]>([]);

  const orderItemList = computed<OrderItemListItem[]>(() => {
    if (!orderItems.value || orderItems.value.length === 0) {
      return [];
    }

    console.log("Mapping orderItems to orderItemList:", orderItems.value);

    return orderItems.value.map((item) => {
      return {
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_specification_id: item.product_specification_id,
        product_name: item.product_snapshot_name,
        product_price: item.product_snapshot_price,
        quantity: item.quantity,
        total: item.total,
        created_at: item.created_at,
      };
    });
  });

  const getOrderItems = async (
    paginationParams?: PaginationParams,
    searchKey?: string,
    filters?: {
      order_id: string;
    }
  ): Promise<ApiPaginated<OrderItem>> => {
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

    if (filters?.order_id) {
      pageQuery += pageQuery
        ? `&order_id=${filters.order_id}`
        : `?search=${filters.order_id}`;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch order items:`, "No auth token found");
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const res: ApiPaginated<OrderItem> = await $fetch(
        `${config.public.apiBase}/order-items${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      orderItems.value = res.data;
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

      console.error(`Failed to fetch order items:`, error);
      throw apiError;
    }
  };

  const deleteOrderItem = async (orderItemId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete order item with ID ${orderItemId}:`,
        "No auth token found"
      );
      return;
    }

    try {
      await $fetch(`${config.public.apiBase}/order-items/${orderItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted order item from the order items array
      orderItems.value = orderItems.value.filter(
        (item) => item.id !== orderItemId
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
        `Failed to delete order item with ID ${orderItemId}:`,
        error
      );
      throw apiError;
    }
  };

  return {
    orderItems,
    fetching,
    orderItemList,
    pageMeta,
    links,
    getOrderItems,
    deleteOrderItem,
  };
});
