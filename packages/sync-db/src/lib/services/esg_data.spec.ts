import supabase from './supabase';

describe('Check Query', () => {
  it.skip('fetches data', async () => {
    const { data, error } = await supabase
      .from('playlists')
      .select(`*, playlist_categories(title)`)
      .eq('active', true)
      .order('publish_date', { ascending: false });

    console.log('Data fetched successfully:', JSON.stringify(data, null, 2));

    expect(error).toBe(null);
  });
});
