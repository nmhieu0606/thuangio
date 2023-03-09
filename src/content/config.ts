// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// 2. Define a schema for each collection you'd like to validate.
const blog = defineCollection({
  schema: z.object({
    
    title: z.string().max(60,"For optimize SEO, Vui long nhập 60 ký tự hoặc nhỏ hơn"),
    description:z.string().max(160,"For optimize SEO, Vui long nhập 160 ký tự hoặc nhỏ hơn"),
    date:z.date(),
    draft: z.boolean().optional(),
    author: z.enum(["hieu1","hieu2","hieu3"]),
    category: z.enum(["CSS","HTML"]),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  blog,
};
