import type { Navigation } from "~/types/Navigation.types";

export const useNavigationStore = defineStore("navigationStore", () => {
  const navigation = ref<Navigation[]>([
    {
      title: "Dashboard",
      path: "/",
      icon: "i-lucide-layout-dashboard",
    },
    {
      title: "Catalog",
      icon: "i-lucide-library",
      children: [
        {
          title: "Products",
          path: "/products",
          icon: "i-lucide-layers",
        },
        {
          title: "Categories",
          path: "/categories",
          icon: "i-lucide-chart-bar-stacked",
        },
        {
          title: "Attributes",
          path: "/attributes",
          icon: "i-lucide-columns-3-cog",
        },
        {
          title: "Brands",
          path: "/brands",
          icon: "i-lucide-tag",
        },
      ],
    },
    {
      title: "Transactions",
      icon: "i-lucide-arrow-left-right",
      children: [
        {
          title: "Orders",
          path: "orders",
          icon: "i-lucide-ticket-check",
        },
        {
          title: "Returns",
          path: "returns",
          icon: "i-lucide-ticket-x",
        },
        {
          title: "Carts",
          path: "carts",
          icon: "i-lucide-shopping-bag",
        },
        {
          title: "Invoices",
          path: "invoices",
          icon: "i-lucide-file-text",
        },
        {
          title: "Vouchers",
          path: "vouchers",
          icon: "i-lucide-gift",
        },
      ],
    },
    {
      title: "Customers",
      icon: "i-lucide-users",
      children: [
        {
          title: "Customer List",
          path: "/customers",
          icon: "i-lucide-user",
        },
        {
          title: "Groups",
          path: "/customer-groups",
          icon: "i-lucide-users",
        },
        {
          title: "Messages",
          path: "/customer-messages",
          icon: "i-lucide-message-circle",
        },
      ],
    },
  ]);

  /**
   * Recursive finder
   */
  const findActiveRecursive = (
    items: Navigation[],
    currentPath: string
  ): Navigation | null => {
    for (const item of items) {
      if (item.path === currentPath) {
        return item;
      }

      if (item.children?.length) {
        const found = findActiveRecursive(item.children, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Computed active page (recursive)
   */
  const activePage = computed(() => {
    pageTitle.value = null; // reset the page title to null on every route change
    const route = useRoute();
    console.log(route.path);
    return (
      findActiveRecursive(navigation.value, route.path) ?? {
        title: "",
        path: route.path,
      }
    );
  });

  const pageTitle = ref<string | null>(null);

  const setPageTitle = (title: string) => {
    setTimeout(() => {
      pageTitle.value = title;
    }, 100); // wait for route change before executing this change
  };

  return {
    navigation,
    activePage,
    pageTitle,
    setPageTitle,
  };
});
