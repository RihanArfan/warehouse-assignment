// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: { port: 3000 },

  extends: ["../../packages/base-client"],
});
