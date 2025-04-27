import { fetchYTPlaylistDetails, fetchYTFullPlaylist } from './youtube-playlist';

describe('fetchYTPlaylistDetails', () => {
  it.skip('should fetch full details', async () => {
    const playlistId = 'PL7fTdQ2ppzdASPdg05qxv_TNBugtu82Nw';

    const result = await fetchYTPlaylistDetails(playlistId);

    expect(Object.keys(result)).toEqual([
      'playlistId',
      'publishedAt',
      'channelId',
      'channelTitle',
      'playlistTitle',
      'playlistDescription',
      'thumbnailDefault',
      'thumbnailMedium',
      'thumbnailHigh',
      'thumbnailStandard',
      'thumbnailMaxres',
    ]);
  });
});

describe('fetchYTFullPlaylist', () => {
  it.skip('should fetch full playlist', async () => {
    const playlistId = 'PL7fTdQ2ppzdASPdg05qxv_TNBugtu82Nw';

    const result = await fetchYTFullPlaylist(playlistId);

    expect(result.length).toEqual(8);
  });
});
