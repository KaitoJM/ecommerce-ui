import type { FetchError } from "ofetch";
import { defineStore } from "pinia";
import type { ApiError, ApiSuccess } from "~/types/ApiResponses.types";
import type { Category } from "~/types/Category.types";
import type { Customer, Gender } from "~/types/Customer.types";

export interface CustomerInformationForm {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: Gender;
  birthday: string;
  phone: string;
  user_id: string;
}

const config = useRuntimeConfig();

export const useCustomerFormStore = defineStore("customerFormStore", () => {
  const customer = ref<Customer | null>(null);
  const customerInformation = ref<CustomerInformationForm>({
    id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    gender: "male",
    birthday: "",
    phone: "",
    user_id: "",
  });

  const getCustomer = async (id: string): Promise<Customer> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to fetch customer information`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const res: ApiSuccess<Customer> = await $fetch(
        `${config.public.apiBase}/customers/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      customer.value = res.data;

      //category information
      customerInformation.value = {
        id: customer.value.id,
        first_name: customer.value.first_name,
        last_name: customer.value.last_name,
        middle_name: customer.value.middle_name,
        gender: customer.value.gender,
        birthday: customer.value.birthday,
        phone: customer.value.phone,
        user_id: customer.value.user_id,
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
    customer,
    customerInformation,
    getCustomer,
  };
});
