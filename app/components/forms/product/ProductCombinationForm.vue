<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 mt-4">
      <div class="w-80 flex flex-col gap-4">
        <UForm
          @submit.prevent="handleProductAttributeSubmit"
          class="flex flex-col gap-2"
        >
          <UFormField label="Attribute" class="w-full">
            <UFieldGroup class="w-full">
              <USelectMenu
                v-model="productAttributeForm.attribute_id"
                placeholder="Attributes"
                value-key="value"
                :items="attributeItems"
              />
              <UInput
                v-model="productAttributeForm.value"
                placeholder="Attribute value"
                class="w-full"
              />
              <UPopover v-if="isTypeColor()">
                <UTooltip text="Select color value">
                  <UButton color="neutral" variant="outline">
                    <template #leading>
                      <span
                        :style="`background-color: ${productAttributeForm.color_value}`"
                        class="size-5 rounded"
                      />
                    </template>
                  </UButton>
                </UTooltip>

                <template #content>
                  <UColorPicker
                    v-model="productAttributeForm.color_value"
                    class="p-2"
                  />
                </template>
              </UPopover>
            </UFieldGroup>
          </UFormField>
          <UButton
            :loading="addingAttribute"
            type="submit"
            color="primary"
            variant="outline"
            icon="i-lucide-plus"
            label="Add this attribute to product"
            class="flex justify-center"
          />
        </UForm>
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
                  @click="handleDeleteAttributeClick(productAttribute.id)"
                  :loading="deletingAttribute == productAttribute.id"
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
          @click="handleGenerateCombinationClick"
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
          v-if="!productSpecifications.length"
          variant="naked"
          class="my-auto"
          icon="i-lucide-file"
          title="No combinations found"
          description="It looks like you haven't generated any combinations yet."
        />
        <div v-else>
          <table
            class="w-full [&_th,&_td]:px-4 [&_th,&_td]:py-2 [&_th,&_td]:border-b [&_th,&_td]:border-accented [&_td:not(:last-child)]:border-r"
          >
            <thead>
              <tr class="[&_th]:text-xs [&_th]:uppercase">
                <th>Default</th>
                <th class="text-left">Combinations</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="specification in productSpecifications">
                <td>
                  <UCheckbox />
                </td>
                <td>
                  {{
                    specification?.combination
                      ?.map((item: Combination) => item.value)
                      .join(" | ")
                  }}
                </td>
                <td>
                  <UInput placeholder="0.00" v-model="specification.price" />
                </td>
                <td>
                  <UInputNumber placeholder="0" v-model="specification.stock" />
                </td>
                <td>
                  <UButton icon="i-lucide-trash" variant="soft" color="error" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-4 flex justify-end">
            <UButton label="Save" icon="i-lucide-save" size="xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import ConfirmationDialog from "~/components/dialogs/ConfirmationDialog.vue";
import { useAttributeStore } from "~/store/attribute.store";
import { useProductFormStore } from "~/store/productForm.store";
import {
  useProductFormAttributeStore,
  type ProductAttributeForm,
} from "~/store/productFormAttribute.store";
import type {
  Combination,
  ProductAttribute,
  ProductSpecification,
} from "~/types/Product.types";

const productFormStore = useProductFormStore();
const productFormAttributeStore = useProductFormAttributeStore();
const attributeStore = useAttributeStore();
const toast = useToast();

const productId = computed(() => productFormStore.product?.id);
const product = computed(() => productFormStore.product);
const attributeItems = computed(() =>
  attributeStore.attributes.map((attr) => {
    return {
      label: attr.attribute,
      value: attr.id,
    };
  })
);
const productAttributes = computed(
  () => productFormAttributeStore.productAttributes
);
attributeStore.getAttributes({ page: 1, per_page: 100 });

const productAttributeForm: ProductAttributeForm = reactive({
  product_id: productId.value as string,
  attribute_id: "",
  value: "",
  color_value: "red",
});

const isTypeColor = (): boolean => {
  const selectedAttribute = productAttributeForm.attribute_id;

  if (
    attributeStore.attributes.find((attr) => attr.id == selectedAttribute)
      ?.attribute == "Color"
  ) {
    return true;
  }

  return false;
};

const addingAttribute = computed(
  () => productFormAttributeStore.addingAttribute
);
const handleProductAttributeSubmit = async () => {
  try {
    await productFormAttributeStore.createProductAttribute(
      productAttributeForm
    );
  } catch (error) {
    const fetchError = error as FetchError<any>;
    toast.add({
      title: "Error",
      description:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      icon: "i-lucide-octagon-x",
      color: "error",
    });
  }
};

const overlay = useOverlay();
const deleteModel = overlay.create(ConfirmationDialog);
const handleDeleteAttributeClick = (id: string) => {
  deleteModel.open({
    title: "Delete Product Attribute",
    message:
      "Are you sure you want to delete this attribute from this product?",
    onOk: () => {
      deleteAttribute(id);
    },
  });
};

const deletingAttribute = computed(
  () => productFormAttributeStore.deletingAttribute
);
const deleteAttribute = async (id: string) => {
  try {
    await productFormAttributeStore.deleteAttribute(
      id,
      productId.value as string
    );
  } catch (error) {
    const fetchError = error as FetchError<any>;
    toast.add({
      title: "Error",
      description:
        fetchError.data?.message ??
        fetchError.message ??
        "Something went wrong",
      icon: "i-lucide-octagon-x",
      color: "error",
    });
  }
};

const groupByAttribute = (items: ProductAttribute[]) => {
  return Object.values(
    items.reduce((acc: any, item) => {
      const key = item.attribute_id;

      if (!acc[key]) {
        acc[key] = {
          attribute_id: item.attribute_id,
          values: [],
        };
      }

      acc[key].values.push({
        product_attribute_id: item.id,
        value: item.value,
      });

      return acc;
    }, {})
  );
};

const cartesian = (groups: any[]) => {
  return groups.reduce((acc: any[], group: any) => {
    if (!acc.length) {
      return group.values.map((v: any) => [
        {
          product_attribute_id: v.product_attribute_id,
          attribute_id: group.attribute_id,
          value: v.value,
        },
      ]);
    }

    return acc.flatMap((combo) =>
      group.values.map((v: any) => [
        ...combo,
        {
          product_attribute_id: v.product_attribute_id,
          attribute_id: group.attribute_id,
          value: v.value,
        },
      ])
    );
  }, []);
};

const productSpecifications = ref<ProductSpecification[]>([]);
const generatedCombinations = ref<[Combination[]]>([[]]);
const handleGenerateCombinationClick = () => {
  if (!productAttributes.value.length) {
    toast.add({
      title: "No attributes",
      description: "Please add at least one attribute first.",
      color: "warning",
    });
    return;
  }

  // remove all values from product specifications
  productSpecifications.value = [];

  const grouped = groupByAttribute(productAttributes.value);
  generatedCombinations.value = cartesian(grouped);

  generatedCombinations.value.forEach((combinations) => {
    productSpecifications.value.push({
      id: "",
      combination: combinations,
      product_id: productId.value as string,
      price: product.value?.specification?.price ?? 0,
      stock: product.value?.specification?.stock ?? 0,
      default: false,
      sale: false,
      created_at: "",
    });
  });

  const formatCombinationToText = (combination: Combination[]) => {};
};
</script>
