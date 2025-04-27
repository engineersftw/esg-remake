import { fetchESGAllPlaylists } from '@engineersftw/esg-data';
import { fetchYTPlaylistDetails, fetchYTFullPlaylist } from './services/youtube-playlist'

export const youtubeSync = async (): Promise<string> => {
  const esgPlaylists = await fetchESGAllPlaylists();

  console.log('Number of ESG Playlists:', esgPlaylists.length);

  for (const esgPlaylist of esgPlaylists) {
    console.log('Channel Title:', esgPlaylist.playlistTitle);

    if (esgPlaylist.playlistId !== 'PLq2Nv-Sh8EbZEjZdPLaQt1qh_ohZFMDj8') {
      console.log('Skipping playlist:', esgPlaylist.playlistId);
      continue;
    }

    const ytPlaylistDetails = await fetchYTPlaylistDetails(esgPlaylist.playlistId);
    console.log('YT Playlist Details:', ytPlaylistDetails);

    const ytPlaylistItems = await fetchYTFullPlaylist(esgPlaylist.playlistId);
    console.log('YT Playlist Items:', ytPlaylistItems);
  }

  return `Number of ESG Playlists: ${esgPlaylists.length}`;
}
