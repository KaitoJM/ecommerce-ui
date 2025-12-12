<template>
  <form>
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Product</h1>
      <UFormField label="Product" help="The name of the product.">
        <UInput placeholder="Enter product name" class="w-full" />
      </UFormField>
      <UFormField
        label="Short description"
        help="Write a short description of the product"
        hint="(Optional)"
      >
        <UTextarea placeholder="Write something" class="w-full" />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton label="Create Product" variant="outline" />
    </div>
  </form>
</template>
