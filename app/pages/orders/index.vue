<template>
  <div class="flex flex-col gap-2">
    <RecordListVue
      class="mt-4"
      :data="orderStore.orderList"
      :columns="columns"
      :pageMeta="orderStore.pageMeta"
      :pageLinks="orderStore.links"
      :loading="orderStore.fetching"
      @update:page="handlePageUpdate"
      @delete:multiple="handleDeleteOrderMultiple"
    >
      <template #headerLeft>
        <UInput
          v-model="searchKeyword"
          icon="i-lucide-search"
          class="w-full md:w-80"
          size="md"
          variant="outline"
          placeholder="Search orders..."
          @keyup="handleSearchKeyup"
        />
      </template>
      <template #headerAction>
        <UModal v-model:open="showAddOrderModal">
          <UButton
            variant="outline"
            color="primary"
            icon="i-lucide-plus"
            @click="showAddOrderModal = true"
          >
            Add Order
          </UButton>
          <template #content>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam
              accusantium nesciunt magni ab rem! Provident veritatis fugiat
              nostrum iste animi explicabo incidunt dolorem, blanditiis
              temporibus, suscipit vel odio non! Beatae.
            </p>
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
import { useOrderStore } from "~/store/order.store";
import type { Order } from "~/types/Order.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const orderStore = useOrderStore();
const router = useRouter();

const showAddOrderModal = ref<boolean>(false);

const routeQueryPage = computed<number>(() => {
  if (router.currentRoute.value.query?.page) {
    return Number(router.currentRoute.value.query.page);
  }
  return 1;
});

onMounted(() => {
  orderStore.getOrders({ page: routeQueryPage.value });
});

// search keyword
const searchKeyword = ref<string>("");

const handleSearchKeyup = useDebounceFn(() => {
  orderStore.getOrders({ page: routeQueryPage.value }, searchKeyword.value);
}, 400);

const UCheckbox = resolveComponent("UCheckbox");
const UFieldGroup = resolveComponent("UFieldGroup");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");

const columns: TableColumn<Order>[] = [
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
    cell: ({ row }: TableRow<Order>) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "created_at",
    header: "Order Date",
    cell: ({ row }: TableRow<Order>) => {
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
    accessorKey: "customer_id",
    header: "Customer",
    cell: ({ row }: TableRow<Order>) =>
      h(
        "div",
        { class: "flex flex-col" },
        {
          default: () => [
            h(
              "p",
              {},
              row.original?.customer
                ? `${row.original?.customer?.first_name} ${row.original?.customer?.last_name}`
                : "No Customer"
            ),
          ],
        }
      ),
  },
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "Action"),
    cell: ({ row }: TableRow<Order>) => {
      const id = row.original.id;

      const items: DropdownMenuItem[] = [
        {
          label: "Manage order",
          icon: "i-lucide-settings",
          onClick: () => handleEditOrder(id),
        },
        {
          label: "Delete order",
          icon: "i-lucide-trash",
          color: "error",
          onClick: () => handleDeleteOrder(id),
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
const deleteOrderModal = overlay.create(ConfirmationDialog);

const handleViewDetails = (orderId: string) => {
  console.log("View details for order ID:", orderId);
};

const handleEditOrder = (orderId: string) => {
  console.log("Edit order ID:", orderId);
  router.push(`/orders/${orderId}/manage`);
};

const handleDeleteOrder = (orderId: string) => {
  console.log("Delete order ID:", orderId);
  deleteOrderModal.open({
    title: "Delete Order",
    message: "Are you sure you want to delete this order?",
    onOk: () => {
      deleteOrder(orderId);
    },
  });
};

const handlePageUpdate = (page: number) => {
  orderStore.getOrders({ page: page });
};

const deleteOrder = async (id: string) => {
  try {
    await orderStore.deleteOrder(id);
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

const handleDeleteOrderMultiple = (ids: string[]) => {
  ids.forEach(async (id) => {
    console.log("Delete order ID:", id);
    await orderStore.deleteOrder(id);
  });
};
</script>
