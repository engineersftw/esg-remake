export type ESGPlaylistDetails = {
  id?: string;
  playlistId: string;
  playlistTitle: string;
  playlistDescription: string;
  publishedAt: string;
  channelId?: string;
  channelTitle?: string;
  thumbnailDefault?: string;
  thumbnailMedium?: string;
  thumbnailHigh?: string;
  thumbnailStandard?: string;
  thumbnailMaxres?: string;
  website?: string;
  playlist_category_id?: string;
  playlist_category_name?: string;
  slug?: string;
};

export type ESGVideoItem = {
  id?: string;
  videoId: string;
  videoTitle: string;
  videoDescription: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  thumbnailDefault?: string;
  thumbnailMedium?: string;
  thumbnailHigh?: string;
  thumbnailStandard?: string;
  thumbnailMaxres?: string;
  slug?: string;
};
