import { defineCollection, z } from 'astro:content';
import matter from 'gray-matter';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const blog = defineCollection({
  loader: {
    name: 'mdoc-blog-loader',
    load: async ({ store, parseData }) => {
      const dir = join(process.cwd(), 'src/content/blog');
      let files: string[];
      try {
        files = (await readdir(dir)).filter(f => f.endsWith('.mdoc'));
      } catch {
        return;
      }

      for (const file of files) {
        const raw = await readFile(join(dir, file), 'utf-8');
        const { data, content: body } = matter(raw);
        const id = file.replace('.mdoc', '');
        if (data.publishDate instanceof Date) {
          data.publishDate = data.publishDate.toISOString().slice(0, 10);
        }
        const parsedData = await parseData({ id, data });
        store.set({ id, data: parsedData, body });
      }
    },
  },
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog };
