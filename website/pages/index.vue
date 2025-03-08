<script setup>
import { useSupabase } from "~/composable/supabase";

const videos = ref([]);

async function getVideos() {
  const { data } = await useSupabase()
    .from("episodes")
    .select()
    .order("published_at", { ascending: false })
    .limit(10);

  videos.value = data;
}

const videoUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

onMounted(() => {
  getVideos();
});
</script>

<template>
  <h1>Engineers.SG (WIP)</h1>
  <ul>
    <li v-for="video in videos" :key="video.id">
      <p><img :src="video.image2" alt="thumbnail" /></p>
      <p>
        <NuxtLink :to="{ name: 'video-id', params: { id: video.id } }">{{
          video.title
        }}</NuxtLink>
        [<a :href="videoUrl(video.video_id)" target="_blank">Video</a>]
      </p>
    </li>
  </ul>
</template>
