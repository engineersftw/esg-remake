<script setup>
import { useSupabase } from "~/composable/supabase";
import YouTubeListItem from "~/components/YouTubeListItem.vue";

const videos = ref([]);

async function getVideos() {
  const { data } = await useSupabase()
    .from("episodes")
    .select()
    .order("published_at", { ascending: false })
    .limit(10);

  videos.value = data;
}

onMounted(() => {
  getVideos();
});
</script>

<template>
  <h1>Engineers.SG (WIP)</h1>
  <ul>
    <li v-for="video in videos" :key="video.id">
      <YouTubeListItem :video="video" />
    </li>
  </ul>
</template>
