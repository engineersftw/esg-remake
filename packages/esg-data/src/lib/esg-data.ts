/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supabase from './services/supabase';
import { toSlug } from './helpers/url_helpers';
import {
  ESGPlaylistDetails,
  ESGVideoItem,
  ESGOrganization,
  ESGPresenter,
} from './types';

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

const fetchESGAllVideos = async (): Promise<ESGVideoItem[]> => {
  const { count, error: countError } = await supabase
    .from('episodes')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  if (countError) {
    console.error('Error fetching count from Supabase:', countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const videos: ESGVideoItem[] = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from('episodes')
      .select(
        `*,
      videoOrgs:video_organizations!episode_id(
        organization:organizations!organization_id(*)
      ),
      videoPresenters:video_presenters!episode_id(
        presenter:presenters!presenter_id(*)
      )
      `
      )
      .eq('active', true)
      .range(range[0], range[1])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }

    for (const row of data) {
      const organizations = [];
      const presenters = [];

      if (Object.prototype.hasOwnProperty.call(row, 'videoOrgs')) {
        organizations.push(
          ...row['videoOrgs'].map((org: any) => {
            const organization = org['organization'];

            const actualSlug = organization['slug']
              ? organization['slug']
              : `${toSlug(organization['title'])}--${organization['id']}`;

            const imageUrl = organization['image']
              ? organization['image']
              : `https://avatar.iran.liara.run/username?username=${encodeURI(
                  organization['title']
                )}`;

            return {
              id: `${organization['id']}`,
              orgTitle: organization['title'],
              orgDescription: organization['description'],
              website: organization['website'],
              twitter: organization['twitter'],
              logoImage: imageUrl,
              contactPerson: organization['contact_person'],
              slug: actualSlug,
            };
          })
        );
      }

      if (Object.prototype.hasOwnProperty.call(row, 'videoPresenters')) {
        presenters.push(
          ...row['videoPresenters'].map((presenter: any) => {
            const presenterData = presenter['presenter'];

            const avatarUrl = presenterData['avatar_url']
              ? presenterData['avatar_url']
              : `https://avatar.iran.liara.run/username?username=${encodeURI(
                  presenterData['name']
                )}`;

            return {
              id: `${presenterData['id']}`,
              presenterName: presenterData['name'],
              presenterDescription: presenterData['biography'],
              presenterByline: presenterData['byline'],
              twitter: presenterData['twitter'],
              email: presenterData['email'],
              website: presenterData['website'],
              imageUrl: avatarUrl,
              slug: `${toSlug(presenterData['name'])}--${presenterData['id']}`,
            };
          })
        );
      }

      videos.push({
        id: `${row['id']}`,
        videoId: row['video_id'],
        videoTitle: row['title'],
        videoDescription: row['description'],
        publishedAt: row['published_at'],
        thumbnailDefault: row['image1'],
        thumbnailMedium: row['image2'],
        thumbnailHigh: row['image3'],
        slug: `${toSlug(row['title'])}--${row['id']}`,
        organizations: organizations,
        presenters: presenters,
      });
    }
  }

  return videos;
};

const fetchESGAllOrgs = async (): Promise<ESGOrganization[]> => {
  const { count, error: countError } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  if (countError) {
    console.error('Error fetching count from Supabase:', countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const orgs: ESGOrganization[] = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from('organizations')
      .select(
        `*,
      orgVideos:video_organizations!organization_id(
        video:episodes!episode_id(*)
      )
      `
      )
      .eq('active', true)
      .range(range[0], range[1])
      .order('title')
      .order('created_at', {
        ascending: false,
        referencedTable: 'video_organizations',
      });

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }

    for (const row of data) {
      let videos = [];
      if (Object.prototype.hasOwnProperty.call(row, 'orgVideos')) {
        videos = row['orgVideos']
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((orgVideo: any) => {
            const episode = orgVideo['video'];

            if (episode['active'] === false) {
              return null;
            } else {
              return {
                id: `${episode['id']}`,
                videoId: episode['video_id'],
                videoTitle: episode['title'],
                videoDescription: episode['description'],
                publishedAt: episode['published_at'],
                thumbnailDefault: episode['image1'],
                thumbnailMedium: episode['image2'],
                thumbnailHigh: episode['image3'],
                slug: `${toSlug(episode['title'])}--${episode['id']}`,
              };
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((element: any) => element !== null);
      }

      const actualSlug = row['slug']
        ? row['slug']
        : `${toSlug(row['title'])}--${row['id']}`;

      const imageUrl = row['image']
        ? row['image']
        : `https://avatar.iran.liara.run/username?username=${encodeURI(
            row['title']
          )}`;

      orgs.push({
        id: `${row['id']}`,
        orgTitle: row['title'],
        orgDescription: row['description'],
        website: row['website'],
        twitter: row['twitter'],
        logoImage: imageUrl,
        contactPerson: row['contact_person'],
        slug: actualSlug,
        videos: videos,
      });
    }
  }

  return orgs;
};

const fetchESGAllPresenters = async (): Promise<ESGPresenter[]> => {
  const { count, error: countError } = await supabase
    .from('presenters')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  if (countError) {
    console.error('Error fetching count from Supabase:', countError);
    throw countError;
  }

  const paginationRanges = breakIntoRanges(count!, 100);

  const presenters: ESGPresenter[] = [];
  for (const range of paginationRanges) {
    const { data, error } = await supabase
      .from('presenters')
      .select(
        `*,
        orgVideos:video_presenters!presenter_id(
          video:episodes!episode_id(*)
        )
        `
      )
      .eq('active', true)
      .range(range[0], range[1])
      .order('name')
      .order('created_at', {
        ascending: false,
        referencedTable: 'video_presenters',
      });

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }

    for (const row of data) {
      let videos = [];
      if (Object.prototype.hasOwnProperty.call(row, 'orgVideos')) {
        videos = row['orgVideos']
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((orgVideo: any) => {
            const episode = orgVideo['video'];

            if (episode['active'] === false) {
              return null;
            } else {
              return {
                id: `${episode['id']}`,
                videoId: episode['video_id'],
                videoTitle: episode['title'],
                videoDescription: episode['description'],
                publishedAt: episode['published_at'],
                thumbnailDefault: episode['image1'],
                thumbnailMedium: episode['image2'],
                thumbnailHigh: episode['image3'],
                slug: `${toSlug(episode['title'])}--${episode['id']}`,
              };
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((element: any) => element !== null);
      }

      const avatarUrl = row['avatar_url']
        ? row['avatar_url']
        : `https://avatar.iran.liara.run/username?username=${encodeURI(
            row['name']
          )}`;

      presenters.push({
        id: `${row['id']}`,
        presenterName: row['name'],
        presenterDescription: row['biography'],
        presenterByline: row['byline'],
        twitter: row['twitter'],
        email: row['email'],
        website: row['website'],
        imageUrl: avatarUrl,
        slug: `${toSlug(row['name'])}--${row['id']}`,
        videos: videos,
      });
    }
  }

  return presenters;
};

const fetchESGAllPlaylists = async (): Promise<ESGPlaylistDetails[]> => {
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
        slug: `${toSlug(row['name'])}--${row['id']}`,
      });
    }
  }

  return videos;
};

const updateESGPlaylist = async (
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

export {
  fetchESGAllVideos,
  fetchESGAllOrgs,
  fetchESGAllPresenters,
  fetchESGAllPlaylists,
  updateESGPlaylist,
};
