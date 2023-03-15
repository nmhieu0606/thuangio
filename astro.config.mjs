import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // https://astro.build/config
import markdownIntegration from '@astropub/md'
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(),markdownIntegration()],
  adapter: netlify(),
  
});