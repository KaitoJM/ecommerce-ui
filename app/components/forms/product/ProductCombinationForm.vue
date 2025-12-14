<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="w-80 flex flex-col gap-4">
        <UFormField label="Attribute">
          <UFieldGroup class="w-full">
            <USelectMenu placeholder="Attributes" :items="attributeItems" />
            <UInput placeholder="Attribute value" />
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-plus"
              label="Add"
            />
          </UFieldGroup>
        </UFormField>
        <p class="text-xs">
          If you did not see your prefered attribute from the list, You can add
          new by clicking
          <NuxtLink to="/attributes" class="text-primary">here</NuxtLink>.
        </p>
        <UEmpty
          v-if="!productAttributes.length"
          icon="i-lucide-file"
          title="No selected attributes yet"
          description="You did not set any attribute for this product yet. it is requried that you set one or more attribute before we can generate a combinations for you."
        />
        <div v-else class="border border-accented rounded-lg overflow-hidden">
          <table class="w-full">
            <tr
              v-for="(productAttribute, paIndex) in productAttributes"
              :key="`product-attribute-item-${paIndex}-${productAttribute.id}`"
            >
              <td class="border border-dashed border-accented py-0.5 px-2">
                <span class="opacity-70 text-sm">{{
                  productAttribute.attribute?.attribute
                }}</span>
              </td>
              <td class="border border-dashed border-accented py-0.5 px-2">
                {{ productAttribute.value }}
              </td>
              <td
                class="border border-dashed border-accented py-0.5 px-2 text-right w-3"
              >
                <UButton
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-lucide-x"
                />
              </td>
            </tr>
          </table>
        </div>
        <UButton
          label="Generate Combinations"
          variant="outline"
          color="neutral"
          class="flex justify-center"
        />
      </div>
      <div
        class="flex-1 flex flex-col gap-4 flex-wrap border border-dashed border-accented p-4 rounded-lg min-h-125"
      >
        <UEmpty
          variant="naked"
          class="my-auto"
          icon="i-lucide-file"
          title="No combinations found"
          description="It looks like you haven't generated any combinations yet."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttributeStore } from "~/store/attribute.store";
import { useProductFormStore } from "~/store/productForm.store";
import { useProductFormAttributeStore } from "~/store/productFormAttribute.store";
import type { ProductAttribute } from "~/types/Product.types";

const productFormStore = useProductFormStore();
const productFormAttributeStore = useProductFormAttributeStore();
const attributeStore = useAttributeStore();

const attributeItems = computed(() =>
  attributeStore.attributes.map((attr) => attr.attribute)
);
const productAttributes = computed(
  () => productFormAttributeStore.productAttributes
);

attributeStore.getAttributes({ page: 1, per_page: 100 });
</script>
