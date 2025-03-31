/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supabase from './supabase';
import { toSlug } from '../helpers/url_helpers';
import { ESGPlaylistDetails } from '../types';

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
