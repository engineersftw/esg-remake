"use strict";

import "dotenv/config";
import { youtube_v3 } from "@googleapis/youtube";

const youtube = new youtube_v3.Youtube({
  version: "v3", // specify the API version to use, in this case v3
  auth: process.env.YOUTUBE_API_KEY,
});

const fetchPlaylistDetails = async (playlistId) => {
  try {
    const res = await youtube.playlists.list({
      part: "id,snippet",
      id: playlistId,
    });
    console.log("Status code: " + res.status);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchPlaylistItems = async (playlistId, nextPageToken = "") => {
  try {
    const res = await youtube.playlistItems.list({
      part: "id,snippet",
      playlistId: playlistId,
      maxResults: 10,
      pageToken: nextPageToken,
    });
    console.log("Status code: " + res.status);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const runSample = async () => {
  const playlistDetails = await fetchPlaylistDetails(
    "PLECEw2eFfW7hYMucZmsrryV_9nIc485P1"
  );
  const playlistItems = await fetchPlaylistItems(
    "PLECEw2eFfW7hYMucZmsrryV_9nIc485P1"
  );

  console.log("Details:", JSON.stringify(playlistDetails, null, 2));
  console.log("Items:", JSON.stringify(playlistItems, null, 2));
};

runSample().catch(console.error);
