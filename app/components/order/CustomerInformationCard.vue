<template>
  <div class="flex flex-col gap-2">
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
      <h5 class="text-xs text-neutral-500">Order placed since registration</h5>
      <UBadge variant="outline" color="info" label="1" />
    </div>
    <div class="flex items-center justify-between gap-2">
      <h5 class="text-xs text-neutral-500">Total spent since registration</h5>
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
</template>

<script setup lang="ts">
import type { Order } from "~/types/Order.types";

const props = defineProps<{
  order: Order;
}>();

const dateFormatter = useDate();
</script>
