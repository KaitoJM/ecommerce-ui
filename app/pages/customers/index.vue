<template>
  <div class="flex flex-col gap-2">
    <RecordListVue
      class="mt-4"
      :data="customerStore.customerList"
      :columns="columns"
      :pageMeta="customerStore.pageMeta"
      :pageLinks="customerStore.links"
      :loading="customerStore.fetching"
      @update:page="handlePageUpdate"
      @delete:multiple="handleDeleteCustomerMultiple"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-full md:w-80"
          size="md"
          variant="outline"
          placeholder="Search customers..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal v-model:open="showAddCustomerModal">
          <UButton
            variant="outline"
            color="primary"
            icon="i-lucide-plus"
            @click="showAddCustomerModal = true"
          >
            Add Customer
          </UButton>
          <template #content>
            <CustomerCreationForm @done="showAddCustomerModal = false" />
          </template>
        </UModal>
      </template>
    </RecordListVue>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import RecordListVue from "~/components/ui/RecordList.vue";
import { onMounted, ref } from "vue";
import type { TableRow } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";
import type { ApiError } from "~/types/ApiResponses.types";
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import { useCustomerStore } from "~/store/customer.store";
import type { CustomerListItem } from "~/types/Customer.types";
import CustomerCreationForm from "~/components/forms/customer/CustomerCreationForm.vue";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const customerStore = useCustomerStore();
const router = useRouter();

const showAddCustomerModal = ref<boolean>(false);

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  customerStore.getCustomers({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  customerStore.getCustomers(
    { page: routeQueryPage.value },
    searchKeyword.value
  );
}, 400);

const UCheckbox = resolveComponent("UCheckbox");
const UFieldGroup = resolveComponent("UFieldGroup");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");

const columns: TableColumn<CustomerListItem>[] = [
  {
    id: "select",
    header: ({
      table,
    }: {
      table: {
        getIsSomePageRowsSelected: any;
        getIsAllPageRowsSelected: any;
        toggleAllPageRowsSelected: any;
      };
    }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }: TableRow<CustomerListItem>) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }: TableRow<CustomerListItem>) =>
      h(
        "div",
        { class: "flex flex-col" },
        {
          default: () => [
            h("p", {}, row.getValue("name")),
            h(
              "p",
              {
                class:
                  "text-xs text-neutral-500 max-w-[400px] overflow-hidden whitespace-nowrap text-ellipsis",
              },
              row.original.user.email
            ),
          ],
        }
      ),
  },
  {
    accessorKey: "birthday",
    header: "Age",
    cell: ({ row }: TableRow<CustomerListItem>) => {
      const birthday = row.getValue("birthday");

      if (!birthday) return "—";

      const birthDate = new Date(birthday);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() >= birthDate.getDate());

      if (!hasHadBirthdayThisYear) {
        age--;
      }

      return age;
    },
  },
  {
    accessorKey: "gender",
    header: "Sex",
    cell: ({ row }: TableRow<CustomerListItem>) => {
      if (row.getValue("gender")) {
        return h(UBadge, { variant: "outline" }, row.getValue("gender"));
      } else {
        return h(UBadge, { variant: "outline", color: "neutral" }, "Unset");
      }
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Registered",
    cell: ({ row }: TableRow<CustomerListItem>) => {
      return new Date(row.getValue("created_at")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "Action"),
    cell: ({ row }: TableRow<CustomerListItem>) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage customer",
          icon: "i-lucide-settings",
          onClick: () => handleEditCustomer(id),
        },
        {
          label: "Delete customer",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteCustomer(id),
        },
      ];

      return h(
        "div",
        { class: "text-right" },
        h(
          UFieldGroup,
          {},
          {
            default: () => [
              h(
                UButton,
                {
                  color: "primary",
                  onClick: () => {
                    handleViewDetails(id);
                  },
                },
                () => "Details"
              ),
              h(
                UDropdownMenu,
                { items: items },
                {
                  default: () => [
                    h(UButton, {
                      color: "primary",
                      icon: "i-lucide-chevron-down",
                    }),
                  ],
                }
              ),
            ],
          }
        )
      );
    },
  },
];

const toast = useToast();
const overlay = useOverlay();
const deleteCustomerModal = overlay.create(ConfirmationDialog);

const handleViewDetails = (customerId: string) => {
  console.log("View details for customer ID:", customerId);
};

const handleEditCustomer = (customerId: string) => {
  console.log("Edit customer ID:", customerId);
  router.push(`/customers/${customerId}/manage`);
};

const handleDeleteCustomer = (customerId: string) => {
  console.log("Delete customer ID:", customerId);
  deleteCustomerModal.open({
    title: "Delete Customer",
    message: "Are you sure you want to delete this customer?",
    onOk: () => {
      deleteCustomer(customerId);
    },
  });
};

const handlePageUpdate = (page: number) => {
  customerStore.getCustomers({ page: page });
};

const deleteCustomer = async (id: string) => {
  try {
    await customerStore.deleteCustomer(id);
    toast.add({
      title: "Deleted",
      description: "Items has bees successfully deleted.",
      color: "success",
      icon: "i-lucide-check",
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
  }
};

const handleDeleteCustomerMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete customer ID:", id);
    await customerStore.deleteCustomer(id);
  });
};
</script>
