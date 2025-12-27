import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Order } from "~/types/Order.types";

const config = useRuntimeConfig();

export const useOrderFormStore = defineStore("orderFormStore", () => {
  const order = ref<Order | null>(null);

  const getOrder = async (id: string): Promise<Order> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch order information`, "No auth token found");
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const res: ApiSuccess<Order> = await $fetch(
        `${config.public.apiBase}/orders/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      order.value = res.data;

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

      console.error("Failed to fetch order information:", error);
      throw apiError;
    }
  };

  return {
    order,
    getOrder,
  };
});
