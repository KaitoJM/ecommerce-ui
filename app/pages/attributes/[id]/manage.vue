<template>
  <div>
    <UForm class="flex flex-col gap-4" @submit.prevent="updateAttribute()">
      <div class="flex flex-col gap-4">
        <UFormField label="Attribute" help="The name of the attribute.">
          <UInput
            v-model="attribute"
            placeholder="Enter attribute name"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Selection Type" hint="(Optional)">
          <USelect
            v-model="selection_type"
            :items="selectionTypeItems"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex justify-end gap-4 border-t border-accented py-4">
        <UButton
          :loading="loading"
          type="submit"
          label="Save Attribute Information"
          icon="i-lucide-save"
          size="xl"
          variant="outline"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useAttributeStore } from "~/store/attribute.store";
import { useAttributeFormStore } from "~/store/attributeForm.store";
import { useNavigationStore } from "~/store/navigation.store";
import type { ApiError } from "~/types/ApiResponses.types";
import type { Attribute } from "~/types/Attribute.types";

definePageMeta({
  layout: "main-template",
  middleware: "auth",
});

const navigationStore = useNavigationStore();
const attributeStore = useAttributeStore();
const attributeFormStore = useAttributeFormStore();
const route = useRoute();
const toast = useToast();

const selectionTypeItems = ref(["radio", "dropdown", "color"]);

// form fields declarations
const attribute = computed({
  get: () => attributeFormStore.attributeInformation.attribute,
  set: (value) => (attributeFormStore.attributeInformation!.attribute = value),
});

const selection_type = computed({
  get: () => attributeFormStore.attributeInformation.selection_type,
  set: (value) =>
    (attributeFormStore.attributeInformation!.selection_type = value),
});

const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    const attribute: Attribute = await attributeFormStore.getAttribute(
      route.params.id as string
    );
    navigationStore.setPageTitle(`Manage Attribute "${attribute.attribute}"`);
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

const updateAttribute = async () => {
  loading.value = true;
  try {
    await attributeStore.updateAttribute(route.params.id as string, {
      attribute: attribute.value,
      selection_type: selection_type.value,
    });

    toast.add({
      title: "Success",
      description: "Attribute saved successfully.",
      icon: "i-lucide-check",
      color: "success",
    });
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
};
</script>
