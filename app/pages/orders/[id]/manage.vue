<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between gap-2">
      <div class="flex gap-2 items-center">
        <UButton
          label="Print Order"
          icon="i-lucide-printer"
          variant="outline"
        />
        <UButton
          label="View Invoice"
          icon="i-lucide-file-text"
          variant="outline"
        />
      </div>
      <div class="flex justify-end gap-2 items-center">
        <USelectMenu
          v-model="status"
          :items="orderStatuseOptions"
          class="w-48"
        />
        <UButton label="Update Status" />
      </div>
    </div>
    <div class="flex gap-8">
      <div class="w-80 max-w-80">
        <CustomerInformationCard v-if="order" :order="order" />
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <h4 class="uppercase font-bold text-xs">Summary</h4>
        <div class="flex gap-4">
          <SummaryCard label="Sub Total" icon="i-lucide-square-sigma">
            <template #value>
              <div class="flex gap-2 items-center">
                {{ order?.subtotal }} PHP
                <span class="text-xs">php</span>
              </div>
            </template>
          </SummaryCard>
          <SummaryCard label="Total Discount" icon="i-lucide-percent">
            <template #value>
              <div class="flex gap-2 items-center">
                {{ order?.discount_total }}
                <span class="text-xs">PHP (0%)</span>
              </div>
            </template>
          </SummaryCard>
          <SummaryCard label="Total" icon="i-lucide-sigma">
            <template #value>
              <div class="flex gap-2 items-center">
                {{ order?.total }}
                <span class="text-xs">PHP</span>
              </div>
            </template>
          </SummaryCard>
        </div>
        <div class="flex gap-2 justify-end my-4">
          <UButton
            label="Add Discount"
            icon="i-lucide-ticket-percent"
            variant="outline"
          />
          <UButton
            label="Add New Product"
            icon="i-lucide-plus"
            variant="outline"
          />
        </div>
        <OrderItemList v-if="orderItems?.length" :items="orderItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SummaryCard from "~/components/dashboard/SummaryCard.vue";
import CustomerInformationCard from "~/components/order/customerInformationCard.vue";
import OrderItemList from "~/components/order/OrderItemList.vue";
import { useNavigationStore } from "~/store/navigation.store";
import { useOrderFormStore } from "~/store/orderForm.store";
import { useOrderItemStore } from "~/store/orderItem.store";
import { useOrderStatusStore } from "~/store/orderStatus.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Order } from "~/types/Order.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const orderFormStore = useOrderFormStore();
const orderItemStore = useOrderItemStore();
const orderStatusStore = useOrderStatusStore();
const navigationStore = useNavigationStore();
const route = useRoute();
const toast = useToast();

const status = ref("Pending");
const order = computed(() => orderFormStore.order);
const orderItems = computed(() => orderItemStore.orderItemList);
const orderStatuseOptions = computed(() =>
  orderStatusStore.orderStatuses.map((status) => ({
    value: status.id,
    label: status.status,
  }))
);

const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    orderStatusStore.getOrderStatuses({ page: 1, per_page: 100 });

    // Get order
    const order: Order = await orderFormStore.getOrder(
      route.params.id as string
    );

    // Update page title
    navigationStore.setPageTitle(
      `Manage Order "#${order.id} - ${order?.customer?.first_name} ${order?.customer?.last_name}"`
    );

    // Get order items
    await orderItemStore.getOrderItems({ page: 1, per_page: 100 }, "", {
      order_id: order.id,
    });
  } catch (error) {
    loading.value = false;

    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
