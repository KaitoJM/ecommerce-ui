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
    const route = useRoute();
    return findActiveRecursive(navigation.value, route.path);
  });

  return {
    navigation,
    activePage,
  };
});
