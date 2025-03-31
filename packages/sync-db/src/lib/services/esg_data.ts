/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supabase from './supabase';
import { toSlug } from '../helpers/url_helpers';
import { ESGPlaylistDetails, ESGVideoItem } from '../types';

const breakIntoRanges = (number: number, rangeSize = 50) => {
  if (typeof number !== 'number' || number < 0 || !Number.isInteger(number)) {
    throw new Error('First argument must be a non-negative integer.');
  }

  if (
    typeof rangeSize !== 'number' ||
    rangeSize <= 0 ||
    !Number.isInteger(rangeSize)
  ) {
    throw new Error('Second argument must be a positive integer.');
  }

  const ranges = [];
  let start = 0;

  while (start <= number) {
    const end = Math.min(start + rangeSize - 1, number);
    ranges.push([start, end]);
    start += rangeSize;
  }

  return ranges;
};

export const fetchPlaylists = async (): Promise<ESGPlaylistDetails[]> => {
  const { count, error: countError } = await supabase
    .from('playlists')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  if (countError) {
    console.error('Error fetching count from Supabase:', countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const videos: ESGPlaylistDetails[] = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from('playlists')
      .select(`*, playlist_categories(title)`)
      .eq('active', true)
      .range(range[0], range[1])
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }

    for (const row of data) {
      videos.push({
        id: `${row['id']}`,
        playlistId: row['playlist_id'],
        playlistTitle: row['name'],
        playlistDescription: row['description'],
        publishedAt: row['publish_date'],
        website: row['website'],
        playlist_category_id: row['playlist_category_id'],
        playlist_category_name: row['playlist_categories']['title'],
        thumbnailDefault: row['image'],
        slug: `${toSlug(row['title'])}--${row['id']}`,
      });
    }
  }

  return videos;
};

export const updatePlaylist = async (
  playlistId: string,
  playlistDetails: ESGPlaylistDetails,
  playlistItems?: ESGVideoItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  if (!playlistId || !playlistDetails) {
    throw new Error('Playlist ID and details are required.');
  }

  const { data: playlistDetailsRecord, error: updatePlayListError } =
    await supabase.from('playlists').upsert(
      {
        playlistId: playlistId,
        name: playlistDetails.playlistTitle,
        description: playlistDetails.playlistDescription,
        publish_date: playlistDetails.publishedAt,
        image: playlistDetails.thumbnailDefault,
        website: playlistDetails.website,
        active: true,
      },
      { onConflict: 'playlist_id' }
    );

  if (updatePlayListError) {
    console.error('Error updating playlist in Supabase:', updatePlayListError);
    throw updatePlayListError;
  }

  if (!playlistDetailsRecord || !playlistItems || playlistItems.length === 0) {
    return;
  }

  const { data: playlistItemsRecord, error: upsertError } = await supabase
    .from('episodes')
    .upsert(
      playlistItems.map((item) => ({
        video_id: item.videoId,
        title: item.videoTitle,
        publish_at: item.publishedAt,
        description: item.videoDescription,
        image1: item.thumbnailDefault,
        image2: item.thumbnailMedium,
        image3: item.thumbnailHigh,
        active: true,
        video_site: 1,
      })),
      { onConflict: 'video_id' }
    )
    .select();
  if (upsertError) {
    console.error('Error upserting playlist items in Supabase:', upsertError);
    throw upsertError;
  }

  // Check if playlistItemsRecord is not empty
  if (!playlistItemsRecord) {
    console.error('No playlist items found in Supabase.');
    return;
  }

  // Delete all associated playlist_items
  const { error: deleteError } = await supabase
    .from('playlist_items')
    .delete()
    .eq('playlist_id', playlistDetailsRecord['data'][0]['id']);

  if (deleteError) {
    console.error('Error deleting playlist items in Supabase:', deleteError);
    throw deleteError;
  }

  // Insert new playlist_items
  const { data: playlistItemsJoinTableRecord, error: insertError } =
    await supabase
      .from('playlist_items')
      .insert(
        playlistItemsRecord.map((item) => ({
          playlist_id: playlistDetailsRecord['data'][0]['id'],
          episode_id: item['id'],
        }))
      )
      .select();
  if (insertError) {
    console.error('Error inserting playlist items in Supabase:', insertError);
    throw insertError;
  }
  console.log(
    `Inserted ${playlistItemsRecord.length} playlist items for playlist ID ${playlistId}`
  );

  return {
    playlistDetailsRecord,
    playlistItemsRecord,
    playlistItemsJoinTableRecord,
  };
};
