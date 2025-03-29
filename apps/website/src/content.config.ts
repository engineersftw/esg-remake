import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import supabase from "./libs/supabase";

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
  loader: async () => {
    const { data, error } = await supabase
      .from("episodes")
      .select()
      .eq("active", true)
      .limit(100)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return [];
    }

    return data.map((row: any) => ({
      id: `${row["id"]}`,
      youtubeVideoId: row["video_id"],
      videoTitle: row["title"],
      videoDescription: row["description"],
      pubDate: new Date(row["published_at"]),
      thumbnailDefault: row["image1"],
      thumbnailMedium: row["image2"],
      thumbnailHigh: row["image3"],
    }));
  },
  schema: z.object({
    id: z.string(),
    youtubeVideoId: z.string(),
    videoTitle: z.string(),
    videoDescription: z.string(),
    pubDate: z.coerce.date(),
    thumbnailDefault: z.string(),
    thumbnailMedium: z.string(),
    thumbnailHigh: z.string(),
  }),
});

const organization = defineCollection({
  loader: async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select()
      .eq("active", true)
      .limit(100)
      .order("title");

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return [];
    }

    const organizations = [];

    for (const row of data) {
      // const { data: orgData, error: orgError } = await supabase
      //   .from("video_organizations")
      //   .select(`episode_id!inner(episode_id)`)
      //   .eq("organization_id", row["id"])
      //   .limit(10)
      //   .order("created_at", { ascending: false });

      // let videoList: any[] = [];
      // if (orgError) {
      //   console.error("Error fetching data from Supabase:", orgError);
      // } else {
      //   videoList = orgData.map((video_org: any) => {
      //     const episode = video_org["episode"];
      //     return {
      //       id: `${episode["id"]}`,
      //       youtubeVideoId: episode["video_id"],
      //       videoTitle: episode["title"],
      //       videoDescription: episode["description"],
      //       pubDate: new Date(episode["published_at"]),
      //       thumbnailDefault: episode["image1"],
      //       thumbnailMedium: episode["image2"],
      //       thumbnailHigh: episode["image3"],
      //     };
      //   });
      // }

      organizations.push({
        id: `${row["id"]}`,
        orgTitle: row["title"],
        orgDescription: row["description"],
        website: row["website"],
        twitter: row["twitter"],
        logoImage: row["image"],
        contactPerson: row["contact_person"],
        slug: row["slug"],
        videos: [],
      });
    }
    return organizations;
  },
  schema: z.object({
    id: z.string(),
    orgTitle: z.string(),
    orgDescription: z.string().nullable(),
    website: z.string().nullable(),
    twitter: z.string().nullable(),
    logoImage: z.string().nullable(),
    contactPerson: z.string().nullable(),
    slug: z.string().nullable(),
    videos: z.array(
      z.object({
        id: z.string(),
        youtubeVideoId: z.string(),
        videoTitle: z.string(),
        videoDescription: z.string(),
        pubDate: z.coerce.date(),
        thumbnailDefault: z.string(),
        thumbnailMedium: z.string(),
        thumbnailHigh: z.string(),
      })
    ),
  }),
});

export const collections = { blog, video, organization };
