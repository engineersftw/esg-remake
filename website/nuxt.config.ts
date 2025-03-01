// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  hooks: {
    async "prerender:routes"(ctx) {
      const samplePage = {
        name: "sample",
        content: "Hello World!",
      };

      ctx.routes.add(`/videos/${samplePage.name}`);
    },
  },
});
