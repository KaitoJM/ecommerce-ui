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
        <USelectMenu v-model="status" :items="statuses" class="w-48" />
        <UButton label="Update Status" />
      </div>
    </div>
    <div class="flex gap-8">
      <div class="w-80 max-w-80 flex flex-col gap-2">
        <h4 class="uppercase font-bold text-xs">Customer</h4>
        <USeparator />
        <UUser
          :name="`${order?.customer?.first_name} ${order?.customer?.last_name}`"
          description="Software Engineer"
          :avatar="{
            src: 'https://i.pravatar.cc/150?u=john-doe',
          }"
        />
        <USeparator />
        <div class="flex items-center justify-between gap-2">
          <h5 class="text-xs text-neutral-500">Account registered</h5>
          <UBadge
            variant="outline"
            color="info"
            :label="
              order?.customer?.created_at
                ? dateFormatter.formatDate(order.customer.created_at)
                : '---'
            "
            icon="i-lucide-calendar"
          />
        </div>
        <div class="flex items-center justify-between gap-2">
          <h5 class="text-xs text-neutral-500">
            Order placed since registration
          </h5>
          <UBadge variant="outline" color="info" label="1" />
        </div>
        <div class="flex items-center justify-between gap-2">
          <h5 class="text-xs text-neutral-500">
            Total spent since registration
          </h5>
          <UBadge variant="outline" color="info" label="1000.00PHP" />
        </div>
        <USeparator />
        <div class="flex flex-col gap-2">
          <h5 class="text-xs text-neutral-500">Home Address</h5>
          <UAlert variant="subtle" color="neutral">
            <template #description>
              John Doe<br />
              Purok 1, Brgy. Amampacang,<br />
              Tinambacan District, <br />
              Calbayog City,<br />
              Samar, Philippines
            </template>
          </UAlert>
        </div>
        <div class="flex flex-col gap-2">
          <h5 class="text-xs text-neutral-500">Office Address</h5>
          <UAlert variant="subtle" color="neutral">
            <template #description>
              John Doe<br />
              Purok 1, Brgy. Amampacang,<br />
              Tinambacan District, <br />
              Calbayog City,<br />
              Samar, Philippines
            </template>
          </UAlert>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <h4 class="uppercase font-bold text-xs">Summary</h4>
        <div class="flex gap-4">
          <SummaryCard label="Sub Total" icon="i-lucide-square-sigma">
            <template #value>
              <div class="flex gap-2 items-center">
                1000.00 PHP
                <span class="text-xs">php</span>
              </div>
            </template>
          </SummaryCard>
          <SummaryCard label="Total Discount" icon="i-lucide-percent">
            <template #value>
              <div class="flex gap-2 items-center">
                200.00
                <span class="text-xs">PHP (20%)</span>
              </div>
            </template>
          </SummaryCard>
          <SummaryCard label="Total" icon="i-lucide-sigma">
            <template #value>
              <div class="flex gap-2 items-center">
                800.00
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SummaryCard from "~/components/dashboard/SummaryCard.vue";
import { useNavigationStore } from "~/store/navigation.store";
import { useOrderFormStore } from "~/store/orderForm.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Order } from "~/types/Order.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const orderFormStore = useOrderFormStore();
const navigationStore = useNavigationStore();
const route = useRoute();
const toast = useToast();
const dateFormatter = useDate();

const statuses = ref(["Pending", "Cancelled", "In Progress", "Delivered"]);
const status = ref("Pending");
const order = computed(() => orderFormStore.order);

const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    const order: Order = await orderFormStore.getOrder(
      route.params.id as string
    );
    navigationStore.setPageTitle(
      `Manage Order "#${order.id} - ${order?.customer?.first_name} ${order?.customer?.last_name}"`
    );
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
