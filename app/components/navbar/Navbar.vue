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
                :loading="logingOut"
                @click="handleLogoutClick()"
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
import type { FetchError } from "ofetch";
import { useNavigationStore } from "~/store/navigation.store";
import ColorModeToggle from "./ColorModeToggle.vue";
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";

const navigationStore = useNavigationStore();
const overlay = useOverlay();
const logoutModal = overlay.create(ConfirmationDialog);

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

const handleLogoutClick = () => {
  logoutModal.open({
    title: "Logout",
    message: "Are you sure you want to logout of the system?",
    onOk: () => {
      logout();
    },
  });
};

const config = useRuntimeConfig();
const router = useRouter();
const toast = useToast();

const logingOut = ref(false);
const logout = async () => {
  try {
    logingOut.value = true;
    const token = localStorage.getItem("token");

    const res = await $fetch(`${config.public.apiBase}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (err) {
    const fetchError = err as FetchError<any>;
    console.log(fetchError.message);
  } finally {
    logingOut.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }
};
</script>
