import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  site: "https://thuangio.netlify.app/",
  integrations: [tailwind(), image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), mdx(), sitemap({
    filter: page => page !== 'https://stargazers.club/blog'
  })],
  output: "server",
  adapter: netlify()
});