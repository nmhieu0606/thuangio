import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from '@astrojs/netlify/functions';
// https://astro.build/config

// https://astro.build/config

// https://astro.build/config
// import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  site: "https://thuangio.netlify.app/",
  integrations: [tailwind(), image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), mdx(), sitemap({
    customPages: ['https://stargazers.biz/careers']
  })]
});