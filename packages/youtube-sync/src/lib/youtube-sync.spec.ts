import { youtubeSync } from './youtube-sync';

describe('youtubeSync', () => {
  it('should work', async () => {
    expect(await youtubeSync()).toEqual('Number of ESG Playlists: 87');
  });
});
