"use strict";

import "dotenv/config";
import { youtube_v3 } from "@googleapis/youtube";

const recordsPerPage = 2;

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
      maxResults: recordsPerPage,
      pageToken: nextPageToken,
    });
    console.log("Status code: " + res.status);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const runCompiler = async () => {
  const playlistId = "PL7fTdQ2ppzdASPdg05qxv_TNBugtu82Nw";
  // const playlistId = "PLECEw2eFfW7hYMucZmsrryV_9nIc485P1";

  const playlistDetails = await fetchPlaylistDetails(playlistId);
  console.log("Playlist Details:", JSON.stringify(playlistDetails, null, 2));

  let nextPageToken = "";
  let hasNextPage = true;
  let currPage = 1;
  while (hasNextPage) {
    console.log(`Fetching Page ${currPage++}`);
    const playlistItems = await fetchPlaylistItems(playlistId, nextPageToken);
    console.log(
      "Videos inside the playlist:",
      JSON.stringify(playlistItems, null, 2)
    );

    if (!playlistItems.hasOwnProperty("nextPageToken")) {
      hasNextPage = false;
    } else {
      nextPageToken = playlistItems.nextPageToken;
    }
  }
};

runCompiler().catch(console.error);
