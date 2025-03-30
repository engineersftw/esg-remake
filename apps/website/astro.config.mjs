// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.HOSTNAME ? process.env.HOSTNAME : "http://localhost:4321",
  integrations: [mdx(), sitemap()],
  redirects: {
    "/episodes": "/videos",
    "/organizations/[id]": "/organization/[id]",
    "/org/[id]": "/organization/[id]",
    "/o/[id]": "/organization/[id]",
    "/presenters/[id]": "/presenter/[id]",
    "/s/[id]": "/presenter/[id]",
  },
});
