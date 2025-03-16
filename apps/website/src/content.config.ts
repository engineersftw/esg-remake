import { glob, file } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import Papa from "papaparse";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const video = defineCollection({
  loader: file("src/content/videos/video_playlist.csv", {
    parser: (fileContent) => {
      const response = Papa.parse(fileContent, { header: true });

      return response.data.map((row: any) => ({
        id: row["videoId"],
        videoTitle: row["videoTitle"],
        videoDescription: row["videoDescription"],
        pubDate: new Date(row["publishedAt"]),
        channelId: row["channelId"],
        channelTitle: row["channelTitle"],
        playlistId: row["playlistId"],
        playlistTitle: row["playlistTitle"],
        thumbnailDefault: row["thumbnailDefault"],
        thumbnailMedium: row["thumbnailMedium"],
        thumbnailHigh: row["thumbnailHigh"],
        thumbnailStandard: row["thumbnailStandard"],
        thumbnailMaxres: row["thumbnailMaxres"],
      }));
    },
  }),
  schema: z.object({
    id: z.string(),
    videoTitle: z.string(),
    videoDescription: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    channelId: z.string(),
    channelTitle: z.string(),
    playlistId: z.string(),
    playlistTitle: z.string(),
    thumbnailDefault: z.string(),
    thumbnailMedium: z.string(),
    thumbnailHigh: z.string(),
    thumbnailStandard: z.string(),
    thumbnailMaxres: z.string(),
  }),
});

export const collections = { blog, video };
