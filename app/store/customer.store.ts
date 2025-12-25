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

const config = useRuntimeConfig();

export interface CustomerForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const useCustomerStore = defineStore("customerStore", () => {
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
  const customers = ref<Customer[]>([]);

  const customerList = computed<CustomerListItem[]>(() => {
    if (!customers.value || customers.value.length === 0) {
      return [];
    }

    return customers.value.map((customer) => ({
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      gender: customer.gender,
      birthday: customer.birthday,
      phone: customer.phone,
      user_id: customer.user_id,
      user: customer.user,
      created_at: customer.created_at,
    }));
  });

  const getCustomers = async (
    paginationParams?: PaginationParams,
    searchKey?: string
  ): Promise<ApiPaginated<Customer>> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to fetch customers`, "No auth token found");

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
      const res: ApiPaginated<Customer> = await $fetch(
        `${config.public.apiBase}/customers${pageQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      customers.value = res.data;
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

      console.error(`Failed to fetch customers:`, error);
      throw apiError;
    }
  };

  const storeCustomer = async (params: CustomerForm): Promise<Customer> => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(`Failed to create new customer`, "No auth token found");

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      const response: ApiSuccess<Customer> = await $fetch(
        `${config.public.apiBase}/customers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: params,
        }
      );

      customers.value.push(response.data);
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

      console.error(`Failed to create new brand`, error);
      throw apiError;
    }
  };

  const updateCustomer = async (
    customerId: string,
    params: {
      first_name: string;
      last_name: string;
      middle_name: string;
      gender: Gender;
      birthday: string;
      phone: string;
    }
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to update customer with ID ${customerId}:`,
        "No auth token found"
      );

      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/customers/${customerId}`, {
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

      console.error(`Failed to update customer with ID ${customerId}:`, error);
      throw apiError;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        `Failed to delete customer with ID ${customerId}:`,
        "No auth token found"
      );
      throw {
        message: "Authentication required. Please log in again.",
        statusCode: 401,
      } satisfies ApiError;
    }

    try {
      await $fetch(`${config.public.apiBase}/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Remove the deleted category from the customers array
      customers.value = customers.value.filter(
        (customer) => customer.id !== customerId
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

      console.error(`Failed to delete customer with ID ${customerId}:`, error);
      throw apiError;
    }
  };

  return {
    customers,
    fetching,
    customerList,
    pageMeta,
    links,
    getCustomers,
    storeCustomer,
    updateCustomer,
    deleteCustomer,
  };
});
