// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],

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
  },
});
