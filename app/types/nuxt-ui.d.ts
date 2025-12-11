declare module "@nuxt/ui" {
  export interface DropdownMenuItem {
    label: string;
    icon?: string;
    color?: string;
    onClick?: () => void;
  }
}

declare global {
  const UButton: typeof import("@nuxt/ui")["UButton"];
  const UBadge: typeof import("@nuxt/ui")["UBadge"];
  const UCheckbox: typeof import("@nuxt/ui")["UCheckbox"];
  const UFieldGroup: typeof import("@nuxt/ui")["UFieldGroup"];
  const UDropdownMenu: typeof import("@nuxt/ui")["UDropdownMenu"];
}
