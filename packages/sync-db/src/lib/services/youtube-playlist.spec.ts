import { fetchPlaylistDetails, fetchFullPlaylist } from './youtube-playlist';

describe('fetchPlaylistDetails', () => {
  it.skip('should fetch full details', async () => {
    const playlistId = 'PL7fTdQ2ppzdASPdg05qxv_TNBugtu82Nw';

    const result = await fetchPlaylistDetails(playlistId);

    expect(Object.keys(result)).toEqual([
      'playlistId',
      'publishedAt',
      'channelId',
      'channelTitle',
      'title',
      'description',
      'thumbnailDefault',
      'thumbnailMedium',
      'thumbnailHigh',
      'thumbnailStandard',
      'thumbnailMaxres',
    ]);
  });
});

describe('fetchFullPlaylist', () => {
  it.skip('should fetch full playlist', async () => {
    const playlistId = 'PL7fTdQ2ppzdASPdg05qxv_TNBugtu82Nw';

    const result = await fetchFullPlaylist(playlistId);

    expect(result.length).toEqual(8);
  });
});
