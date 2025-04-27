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
  channelId?: string;
  channelTitle?: string;
  thumbnailDefault?: string;
  thumbnailMedium?: string;
  thumbnailHigh?: string;
  thumbnailStandard?: string;
  thumbnailMaxres?: string;
  slug?: string;
  organizations?: ESGOrganization[];
  presenters?: ESGPresenter[];
};

export type ESGOrganization = {
  id?: string;
  orgTitle: string;
  orgDescription: string;
  website: string;
  twitter: string;
  logoImage?: string;
  contactPerson: string;
  slug: string;
  videos?: ESGVideoItem[];
};

export type ESGPresenter = {
  id?: string;
  presenterName: string;
  presenterDescription: string;
  presenterByline: string;
  twitter: string;
  email: string;
  website: string;
  imageUrl: string;
  slug: string;
  videos?: ESGVideoItem[];
};
