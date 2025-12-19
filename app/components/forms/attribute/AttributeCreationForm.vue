<template>
  <form @submit.prevent="handleCreate">
    <div class="py-4 px-6 flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Create New Attribute</h1>
      <UFormField label="Attribute" help="The name of the attribute.">
        <UInput
          v-model="attribute"
          placeholder="Enter attribute name"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Selection Type"
        help="The type of selection for selecting product specification."
      >
        <USelect
          v-model="selection_type"
          :items="['radio', 'dropdown', 'color']"
          class="w-full"
        />
      </UFormField>
    </div>
    <div class="py-4 px-6 border-t border-accented flex justify-end">
      <UButton type="submit" label="Create Attribute" variant="outline" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useAttributeStore } from "~/store/attribute.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { AttributeSelection } from "~/types/Attribute.types";

// composable declarations
const attributeStore = useAttributeStore();
const toast = useToast();

// emits
const emit = defineEmits<{ done: [boolean] }>();

// form fields declarations
const attribute = ref<string>("");
const selection_type = ref<AttributeSelection>("dropdown");

const clearForm = () => {
  attribute.value = "";
};

const handleCreate = async () => {
  try {
    await attributeStore.storeAttribute({
      attribute: attribute.value,
      selection_type: selection_type.value,
    });

    toast.add({
      title: "Success",
      description: `A new attribute has been successfully added.`,
      icon: "i-lucide-info",
    });

    clearForm();
    emit("done", true);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    toast.add({
      title: "Error",
      description: apiError.message,
      icon: "i-lucide-octagon-x",
      color: "error",
    });
    console.error(error);
  }
};
</script>
