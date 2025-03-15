"use strict";

import "dotenv/config";
import { youtube_v3 } from "@googleapis/youtube";

const youtube = new youtube_v3.Youtube({
  version: "v3", // specify the API version to use, in this case v3
  auth: process.env.API_KEY,
});

const fetchPlaylist = async (playlistId) => {
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

const runSample = async () => {
  const data = await fetchPlaylist("PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi");

  console.log(JSON.stringify(data, null, 2));
};

runSample().catch(console.error);
