<script setup lang="ts">
import Logo from "~/components/ui/Logo.vue";
</script>

<template>
  <UDashboardGroup class="h-screen overflow-hidden">
    <UDashboardSidebar>
      <Logo class="my-2 w-80 mx-auto" />
      <Navigation />
    </UDashboardSidebar>
    <UDashboardPanel class="flex flex-col">
      <Navbar />
      <UMain class="p-6 flex-1 overflow-auto">
        <slot></slot>
      </UMain>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
