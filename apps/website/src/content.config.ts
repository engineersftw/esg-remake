import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import {
  fetchAllVideos,
  fetchAllOrgs,
  fetchAllPresenters,
} from "./libs/content_service";

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
  loader: async () => await fetchAllVideos(),
  schema: z.object({
    id: z.string(),
    youtubeVideoId: z.string(),
    videoTitle: z.string(),
    videoDescription: z.string(),
    pubDate: z.coerce.date(),
    thumbnailDefault: z.string().nullable(),
    thumbnailMedium: z.string().nullable(),
    thumbnailHigh: z.string().nullable(),
    slug: z.string(),
  }),
});

const organization = defineCollection({
  loader: async () => await fetchAllOrgs(),
  schema: z.object({
    id: z.string(),
    orgTitle: z.string(),
    orgDescription: z.string().nullable(),
    website: z.string().nullable(),
    twitter: z.string().nullable(),
    logoImage: z.string().nullable(),
    contactPerson: z.string().nullable(),
    slug: z.string(),
    videos: z.array(
      z.object({
        id: z.string(),
        youtubeVideoId: z.string(),
        videoTitle: z.string(),
        videoDescription: z.string(),
        pubDate: z.coerce.date(),
        thumbnailDefault: z.string().nullable(),
        thumbnailMedium: z.string().nullable(),
        thumbnailHigh: z.string().nullable(),
        slug: z.string(),
      })
    ),
  }),
});

const presenter = defineCollection({
  loader: async () => await fetchAllPresenters(),
  schema: z.object({
    id: z.string(),
    presenterName: z.string(),
    presenterDescription: z.string().nullable(),
    presenterByline: z.string().nullable(),
    twitter: z.string().nullable(),
    email: z.string().nullable(),
    website: z.string().nullable(),
    imageUrl: z.string().nullable(),
    slug: z.string(),
    videos: z.array(
      z.object({
        id: z.string(),
        youtubeVideoId: z.string(),
        videoTitle: z.string(),
        videoDescription: z.string(),
        pubDate: z.coerce.date(),
        thumbnailDefault: z.string().nullable(),
        thumbnailMedium: z.string().nullable(),
        thumbnailHigh: z.string().nullable(),
        slug: z.string(),
      })
    ),
  }),
});

export const collections = { blog, video, organization, presenter };
