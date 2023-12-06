// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@vueuse/nuxt"],

  devServer: { port: 3005 },

  ui: {
    icons: ["heroicons", "fluent", "fluent-emoji"],
  },

  colorMode: {
    preference: "light",
  },

  devtools: { enabled: true },

  ssr: false,

  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,

    // Enable environment variables
    // Additional environment variables can be found at
    // https://tauri.app/2/reference/environment-variables/
    envPrefix: ["VITE_", "TAURI_"],

    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },

    vue: {
      script: {
        defineModel: true,
      },
    },
  },

  experimental: {
    typedPages: true,
  },
});
