<template>
  <div>
    <UTabs :items="tabItems">
      <template #information>
        <ProductInformationFormVue />
      </template>
      <template #images>
        <ProductImagesFormVue />
      </template>
      <template #combination>
        <ProductCombinationFormVue />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import ProductCombinationFormVue from "~/components/forms/product/ProductCombinationForm.vue";
import ProductImagesFormVue from "~/components/forms/product/ProductImagesForm.vue";
import ProductInformationFormVue from "~/components/forms/product/ProductInformationForm.vue";
import { useNavigationStore } from "~/store/navigation.store";
import { useProductFormStore } from "~/store/productForm.store";
import { useProductFormAttributeStore } from "~/store/productFormAttribute.store";
import { useProductFormImageStore } from "~/store/productFormImage.store";
import { useProductSpecificationStore } from "~/store/productSpecification.tstore";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const navigationStore = useNavigationStore();
const productFormStore = useProductFormStore();
const productFormImageStore = useProductFormImageStore();
const productFormAttributeStore = useProductFormAttributeStore();
const productSpecifications = useProductSpecificationStore();
const route = useRoute();

const tabItems = [
  {
    label: "Product Information",
    slot: "information",
  },
  {
    label: "Images",
    slot: "images",
  },
  {
    label: "Combinations",
    slot: "combination",
  },
];

await productFormStore.getProduct(route.params.id as string);
await productFormImageStore.getProductImages(route.params.id as string);
await productFormAttributeStore.getProductAttributes(route.params.id as string);
await productSpecifications.getProductSpecifications(route.params.id as string);

onMounted(() => {
  navigationStore.setPageTitle("Manage Product");
});

const state = reactive({
  name: "Benjamin Canac",
  username: "benjamincanac",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
</script>
