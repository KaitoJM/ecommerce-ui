<script setup lang="ts"></script>

<template>
  <UDashboardGroup class="h-screen overflow-hidden">
    <UDashboardSidebar>
      <img src="/assets/images/logo-placeholder.png" class="mt-4" />
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
