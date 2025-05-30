'use strict';

// import 'dotenv/config';
import { youtube_v3 } from '@googleapis/youtube';
import type { ESGPlaylistDetails, ESGVideoItem } from '@engineersftw/esg-data';

const recordsPerPage = 100;

const youtube = new youtube_v3.Youtube({
  auth: process.env['YOUTUBE_API_KEY'],
});

const fetchYTPlaylistDetails = async (
  playlistId: string
): Promise<ESGPlaylistDetails> => {
  try {
    const res = await youtube.playlists.list({
      part: ['id', 'snippet'],
      id: [playlistId],
    });

    if (!res.data.items || res.data.items.length !== 1) {
      throw new Error('No playlist found');
    }

    const playlistSnippet = res.data.items[0].snippet;
    if (!playlistSnippet) {
      throw new Error('No playlist found');
    }
    return {
      playlistId: playlistId,
      publishedAt: `${playlistSnippet.publishedAt}`,
      channelId: `${playlistSnippet.channelId}`,
      channelTitle: `${playlistSnippet.channelTitle}`,
      playlistTitle: `${playlistSnippet.title}`,
      playlistDescription: `${playlistSnippet.description}`,
      thumbnailDefault: `${playlistSnippet?.thumbnails?.default?.url}`,
      thumbnailMedium: `${playlistSnippet?.thumbnails?.medium?.url}`,
      thumbnailHigh: `${playlistSnippet?.thumbnails?.high?.url}`,
      thumbnailStandard: `${playlistSnippet?.thumbnails?.standard?.url}`,
      thumbnailMaxres: `${playlistSnippet?.thumbnails?.maxres?.url}`,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const fetchYTPlaylistItems = async (
  playlistId: string,
  nextPageToken = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    const res = await youtube.playlistItems.list({
      part: ['id', 'snippet'],
      playlistId: playlistId,
      maxResults: recordsPerPage,
      pageToken: nextPageToken,
    });
    // console.log('Status code: ' + res.status);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchYTFullPlaylist = async (
  playlistId: string
): Promise<ESGVideoItem[]> => {
  const result: ESGVideoItem[] = [];

  let nextPageToken = '';
  let hasNextPage = true;
  let currPage = 1;
  while (hasNextPage) {
    console.log(`Fetching Page ${currPage++}`);
    const playlistItems = await fetchYTPlaylistItems(playlistId, nextPageToken);

    for (const item of playlistItems.items) {
      result.push({
        videoId: item.snippet.resourceId.videoId,
        videoTitle: item.snippet.title,
        videoDescription: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        channelId: item.snippet.videoOwnerChannelId,
        channelTitle: item.snippet.videoOwnerChannelTitle,
        thumbnailDefault: item.snippet?.thumbnails?.default?.url,
        thumbnailMedium: item.snippet?.thumbnails?.medium?.url,
        thumbnailHigh: item.snippet?.thumbnails?.high?.url,
        thumbnailStandard: item.snippet?.thumbnails?.standard?.url || '',
        thumbnailMaxres: item.snippet?.thumbnails?.maxres?.url || '',
      });
    }

    if (!Object.prototype.hasOwnProperty.call(playlistItems, 'nextPageToken')) {
      hasNextPage = false;
    } else {
      nextPageToken = playlistItems.nextPageToken;
    }
  }

  return result;
};

export { fetchYTPlaylistDetails, fetchYTFullPlaylist };
