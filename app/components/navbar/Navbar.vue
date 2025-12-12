<template>
  <UDashboardNavbar
    :title="pageTitle"
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
  >
    <template #right>
      <div class="flex gap-3 items-center">
        <ColorModeToggle />
        <UPopover
          :content="{
            align: 'center',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <UAvatar
            src="https://i.pravatar.cc/150?img=3"
            alt="User Avatar"
            size="md"
          />
          <template #content>
            <div class="p-4 flex flex-col w-60 items-center">
              <UAvatar
                src="https://i.pravatar.cc/150?img=3"
                alt="User Avatar"
                size="3xl"
                class="mb-2"
              />
              <p class="font-semibold">John Doe</p>
              <p class="text-sm text-gray-500">johndoe@example.com</p>
              <USeparator class="my-3" />
              <UButton
                variant="outline"
                color="error"
                class="w-full flex items-center justify-center gap-2"
              >
                Logout
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>
    </template>
  </UDashboardNavbar>
</template>

<script setup lang="ts">
import { useNavigationStore } from "~/store/navigation.store";
import ColorModeToggle from "./ColorModeToggle.vue";

const navigationStore = useNavigationStore();

const pageTitle = computed(() => {
  if (navigationStore.pageTitle) {
    return navigationStore.pageTitle;
  } else if (
    navigationStore.activePage?.title &&
    navigationStore.activePage.title != ""
  ) {
    return navigationStore.activePage.title;
  } else {
    return "";
  }
});
</script>
