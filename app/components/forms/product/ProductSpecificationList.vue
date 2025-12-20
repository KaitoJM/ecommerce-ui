<template>
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
          <th></th>
          <th class="text-left">Combinations</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Images</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(specification, specificationIndex) in productSpecifications"
          :key="`specific-row-${specificationIndex}-${specification.id}`"
        >
          <td>
            <UCheckbox
              v-model="specification.default"
              @click="handleDefautCheckClick(specificationIndex)"
            />
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
            <UAvatarGroup>
              <UTooltip text="Manage Images">
                <UButton
                  @click="handleManageImage(specification)"
                  class="font-bold rounded-full"
                  icon="i-lucide-image-plus"
                />
              </UTooltip>
              <UAvatar
                v-for="(image, imageInx) in specification.images.slice(
                  0,
                  specification.images.length > 3 ? 2 : 3
                )"
                :key="`${specification.id}-image-${imageInx}`"
                :src="image"
              />
              <UAvatar
                v-if="specification.images.length > 3"
                :text="`+${specification.images.length - 2}`"
              />
            </UAvatarGroup>
          </td>
          <td>
            <div class="flex justify-end">
              <UButton
                @click="handleRemoveSpecificationClick(specificationIndex)"
                icon="i-lucide-x"
                variant="soft"
                color="error"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-end">
      <UButton
        :loading="savingCombinations"
        @click="handleSaveCombinationsClick"
        label="Save"
        icon="i-lucide-save"
        size="xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import ProductSpecificationImageManager from "~/components/dialogs/ProductSpecificationImageManager.vue";
import { useProductFormStore } from "~/store/productForm.store";
import {
  useProductSpecificationStore,
  type ProductSpecificationForm,
} from "~/store/productSpecification.tstore";
import type { Combination, ProductSpecification } from "~/types/Product.types";

const toast = useToast();
const productFormStore = useProductFormStore();
const productSpecificationStore = useProductSpecificationStore();

const productId = computed(() => productFormStore.product?.id);
let productSpecifications = computed(
  () => productSpecificationStore.productSpecifications
);

const handleDefautCheckClick = (key: number) => {
  productSpecifications.value.forEach((item, itemKey) => {
    item.default = itemKey == key;
  });
};

const handleRemoveSpecificationClick = (key: number) => {
  productSpecifications.value.splice(key, 1);
};

const createCount = ref(0);
const savingCombinations = ref(false);
const handleSaveCombinationsClick = async () => {
  savingCombinations.value = true;

  // delete all specifications of the product
  try {
    await productSpecificationStore.deleteProductSpecificationByProduct(
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

  createCount.value = 0;

  // create new specifications
  for (const productSpecification of productSpecifications.value) {
    const params: ProductSpecificationForm = {
      combination: JSON.stringify(productSpecification.combination),
      product_id: productSpecification.product_id,
      price: productSpecification.price,
      stock: productSpecification.stock,
      default: productSpecification.default,
      sale: productSpecification.sale,
      sale_price: productSpecification.sale_price,
      images: JSON.stringify(productSpecification.images),
    };

    await productSpecificationStore.addProductSpecification(params);
    createCount.value++;
  }

  productSpecificationStore.getProductSpecifications(productId.value as string);
  savingCombinations.value = false;
  toast.add({
    title: "Success",
    description: "New combinations has been saved.",
    icon: "i-lucide-check",
    color: "success",
  });
};

const overlay = useOverlay();
const imageManagerModal = overlay.create(ProductSpecificationImageManager);
const handleManageImage = (specification: ProductSpecification) => {
  imageManagerModal.open({
    selectedImages: specification.images,
    onDone: (images: string[]) => {
      specification.images = images;
    },
  });
};
</script>
