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
      <div class="w-150 flex flex-col gap-2">
        <h4 class="uppercase font-bold text-xs">Customer</h4>
        <USeparator />
        <UUser
          name="John Doe"
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
            label="07/27/2023"
            icon="i-lucide-calendar"
          />
        </div>
        <div class="flex items-center justify-between gap-2">
          <h5 class="text-xs text-neutral-500">Valid order placed</h5>
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
      <div class="flex flex-col gap-2">
        <h4 class="uppercase font-bold text-xs">Products</h4>
        <USeparator />
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam
        doloremque vitae quam suscipit asperiores, ipsum saepe, delectus
        reprehenderit dolores nulla harum minima, quaerat aspernatur
        consequuntur quos laboriosam architecto dolorem nam?
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const statuses = ref(["Pending", "Cancelled", "In Progress", "Delivered"]);
const status = ref("Pending");
</script>
