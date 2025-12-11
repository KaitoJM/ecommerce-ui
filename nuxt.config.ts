// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://127.0.0.1:8000/api/",
    },
  },
});
