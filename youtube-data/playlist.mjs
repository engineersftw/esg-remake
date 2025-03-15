"use strict";

import "dotenv/config";
import { youtube_v3 } from "@googleapis/youtube";
import { stringify } from "csv-stringify";
import fs from "fs";

const recordsPerPage = 2;
const csvFileName = "video_playlist.csv";

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

  const fileStream = fs.createWriteStream(csvFileName, { flags: "w" });
  const stringifier = stringify({ header: false });

  stringifier
    .pipe(fileStream)
    .on("error", (err) => console.error(err))
    .on("finish", () => console.log("Done writing CSV file"));

  stringifier.write([
    "title",
    "description",
    "publishedAt",
    "channelTitle",
    "playlistId",
    "videoId",
  ]);

  let nextPageToken = "";
  let hasNextPage = true;
  let currPage = 1;
  while (hasNextPage) {
    console.log(`Fetching Page ${currPage++}`);
    const playlistItems = await fetchPlaylistItems(playlistId, nextPageToken);

    playlistItems.items.forEach((item) => {
      stringifier.write([
        item.snippet.title,
        item.snippet.description,
        item.snippet.publishedAt,
        item.snippet.channelTitle,
        item.snippet.playlistId,
        item.snippet.resourceId.videoId,
      ]);
    });

    if (!playlistItems.hasOwnProperty("nextPageToken")) {
      hasNextPage = false;
    } else {
      nextPageToken = playlistItems.nextPageToken;
    }
  }

  stringifier.end();
};

runCompiler().catch(console.error);
