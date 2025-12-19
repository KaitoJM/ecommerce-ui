<template>
  <div class="max-w-250 mx-auto">
    <div class="flex flex-col gap-4 mt-4">
      <div class="flex gap-8">
        <div class="flex-1">
          <UCarousel
            v-slot="{ item }"
            dots
            :items="imageSources"
            class="w-full mx-auto"
          >
            <img :src="item" class="rounded-lg object-cover w-full h-[500px]" />
          </UCarousel>
        </div>
        <div class="flex-1 flex flex-col gap-4">
          <h1 class="text-3xl font-bold">
            {{ productFormStore.product?.name }}
          </h1>
          <p class="text-lg flex items-center gap-2 text-primary">
            <span class="font-bold">{{
              productFormStore.product?.specification?.price
            }}</span>
            <span class="text-xs">PHP</span>
          </p>
          <p class="text-sm opacity-80">
            {{ productFormStore.product?.summary }}<br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            repellat porro est dolores laborum. Ut veniam eos distinctio, ea
            amet ullam velit fuga reprehenderit asperiores ducimus libero quos
            consequuntur fugit?
          </p>
          <ul class="border border-accented rounded-lg mt-4">
            <li class="border-b border-accented py-2 px-4 flex justify-between">
              Categories
              <div
                v-if="productFormStore.product?.categories?.length"
                class="flex gap-2 items-center"
              >
                <UBadge
                  variant="outline"
                  color="neutral"
                  v-for="(category, categoryIndex) in productFormStore.product
                    .categories"
                  :key="`category-${categoryIndex}-${category.id}`"
                  >{{ category.name }}</UBadge
                >
              </div>
            </li>
            <li class="border-b border-accented py-2 px-4 flex justify-between">
              Stock
              <UBadge variant="outline" color="neutral">{{
                productFormStore.product?.specification?.stock
              }}</UBadge>
            </li>
            <li class="py-2 px-4 flex justify-between">
              Brand
              <UBadge variant="outline" color="neutral">{{
                productFormStore.product?.brand?.name
              }}</UBadge>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8">
        <div class="border border-accented rounded-lg overflow-hidden">
          <table
            class="w-full [&_th,&_td]:px-4 [&_th,&_td]:py-2 [&_th,&_td]:border-b [&_th,&_td]:border-accented [&_td:not(:last-child)]:border-r"
          >
            <thead>
              <tr class="[&_th]:text-xs [&_th]:uppercase">
                <th class="text-left">Combinations</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(
                  specification, specificationIndex
                ) in productSpecifications"
                :key="`specific-row-${specificationIndex}-${specification.id}`"
              >
                <td>
                  <div class="flex gap-2 items-center">
                    <img
                      v-if="specification.images.length"
                      :src="specification.images[0]"
                      alt=""
                      class="size-10 rounded"
                    />
                    <img
                      v-else
                      src="/image-placeholder.jpg"
                      class="size-10 rounded"
                    />
                    <p>
                      {{
                        specification?.combination
                          ?.map((item: Combination) => item.value)
                          .join(" | ")
                      }}
                    </p>
                  </div>
                </td>
                <td align="right">{{ specification.stock }}</td>
                <td align="right">{{ specification.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-8">
        <p class="font-bold uppercase text-xs opacity-80">Description</p>
        <br />
        <div class="flex flex-col gap-4">
          <p>{{ productFormStore.product?.description }}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, vel
            illo praesentium odit hic reprehenderit numquam ipsum deserunt
            tempora alias nostrum, eum, quia ut porro provident corporis.
            Necessitatibus, illum adipisci. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Quod reiciendis asperiores neque quam
            quo ut cumque sequi quisquam iure ab ullam facere distinctio, ad
            expedita facilis perferendis! Rerum, consequatur consectetur!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, vel
            illo praesentium odit hic reprehenderit numquam ipsum deserunt
            tempora alias nostrum, eum, quia ut porro provident corporis.
            Necessitatibus, illum adipisci. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Quod reiciendis asperiores neque quam
            quo ut cumque sequi quisquam iure ab ullam facere distinctio, ad
            expedita facilis perferendis! Rerum, consequatur consectetur!
          </p>
        </div>
      </div>
      <USeparator class="my-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";
import { useProductFormStore } from "~/store/productForm.store";
import { useProductFormImageStore } from "~/store/productFormImage.store";
import { useProductSpecificationStore } from "~/store/productSpecification.tstore";
import type { Combination } from "~/types/Product.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const navigationStore = useNavigationStore();
const productFormStore = useProductFormStore();
const productFormImageStore = useProductFormImageStore();
const productSpecificationStore = useProductSpecificationStore();
const route = useRoute();

const imageSources = computed<string[]>(() => {
  const productImages = productFormImageStore.productImages ?? [];

  const cover =
    productFormStore.product?.thumbnail ??
    productImages.find((img) => img.cover)?.source ??
    null;

  const otherImages = productImages
    .filter((img) => img.source !== cover)
    .map((img) => img.source);

  return cover ? [cover, ...otherImages] : otherImages;
});

const productSpecifications = computed(
  () => productSpecificationStore.productSpecifications
);

await productFormStore.getProduct(route.params.id as string);
await productFormImageStore.getProductImages(route.params.id as string);
await productSpecificationStore.getProductSpecifications(
  route.params.id as string
);

onMounted(() => {
  navigationStore.setPageTitle("Product Information");
});
</script>
