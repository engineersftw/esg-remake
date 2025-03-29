import supabase from "./supabase";
import { toSlug } from "../helpers/url_helpers";

const breakIntoRanges = (number: number, rangeSize = 50) => {
  if (typeof number !== "number" || number < 0 || !Number.isInteger(number)) {
    throw new Error("First argument must be a non-negative integer.");
  }

  if (
    typeof rangeSize !== "number" ||
    rangeSize <= 0 ||
    !Number.isInteger(rangeSize)
  ) {
    throw new Error("Second argument must be a positive integer.");
  }

  let ranges = [];
  let start = 0;

  while (start <= number) {
    let end = Math.min(start + rangeSize - 1, number);
    ranges.push([start, end]);
    start += rangeSize;
  }

  return ranges;
};

export const fetchAllVideos = async () => {
  const { count, error: countError } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  if (countError) {
    console.error("Error fetching count from Supabase:", countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const videos = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from("episodes")
      .select()
      .eq("active", true)
      .range(range[0], range[1])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      throw error;
    }

    for (const row of data) {
      videos.push({
        id: `${row["id"]}`,
        youtubeVideoId: row["video_id"],
        videoTitle: row["title"],
        videoDescription: row["description"],
        pubDate: new Date(row["published_at"]),
        thumbnailDefault: row["image1"],
        thumbnailMedium: row["image2"],
        thumbnailHigh: row["image3"],
      });
    }
  }

  return videos;
};

export const fetchAllOrgs = async () => {
  const { count, error: countError } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  if (countError) {
    console.error("Error fetching count from Supabase:", countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const orgs = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from("organizations")
      .select(
        `*,
      orgVideos:video_organizations!organization_id(
        video:episodes!episode_id(*)
      )
      `
      )
      .eq("active", true)
      .range(range[0], range[1])
      .order("title");

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      throw error;
    }

    for (const row of data) {
      let videos = [];
      if (row.hasOwnProperty("orgVideos")) {
        videos = row["orgVideos"]
          .map((orgVideo: any) => {
            const episode = orgVideo["video"];

            if (episode["active"] === false) {
              return null;
            } else {
              return {
                id: `${episode["id"]}`,
                youtubeVideoId: episode["video_id"],
                videoTitle: episode["title"],
                videoDescription: episode["description"],
                pubDate: new Date(episode["published_at"]),
                thumbnailDefault: episode["image1"],
                thumbnailMedium: episode["image2"],
                thumbnailHigh: episode["image3"],
              };
            }
          })
          .filter((element: any) => element !== null);
      }

      const actualSlug = row["slug"]
        ? row["slug"]
        : `${toSlug(row["title"])}--${row["id"]}`;

      orgs.push({
        id: `${row["id"]}`,
        orgTitle: row["title"],
        orgDescription: row["description"],
        website: row["website"],
        twitter: row["twitter"],
        logoImage: row["image"],
        contactPerson: row["contact_person"],
        slug: actualSlug,
        videos: videos,
      });
    }
  }

  return orgs;
};
