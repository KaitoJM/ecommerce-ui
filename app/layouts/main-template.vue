<script setup lang="ts">
import type NavigationVue from "~/components/navigation/Navigation.vue";
</script>

<template>
  <UDashboardGroup class="h-screen overflow-hidden">
    <UDashboardSidebar>
      <img src="/assets/images/logo-placeholder.png" class="mt-4" />
      <Navigation />
    </UDashboardSidebar>
    <UDashboardPanel class="flex flex-col">
      <UDashboardNavbar
        title="Dashboard"
        :toggle="{
          color: 'primary',
          variant: 'subtle',
          class: 'rounded-full',
        }"
      >
        <template #right>
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
        </template>
      </UDashboardNavbar>
      <UMain class="p-6 flex-1 overflow-auto">
        <slot></slot>
      </UMain>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
