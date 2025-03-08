<script setup>
import { useSupabase } from "~/composable/supabase";

const video = ref();

const { params } = useRoute();
const videoId = params.id;

async function getVideo() {
  const { data } = await useSupabase()
    .from("episodes")
    .select()
    .eq("id", videoId)
    .limit(1)
    .maybeSingle();

  console.log(data);

  video.value = data;
}

const videoUrl = computed(() => {
  return `https://www.youtube.com/watch?v=${video.value?.video_id}`;
});

onMounted(() => {
  getVideo();
});
</script>

<template>
  <h1>{{ video?.title }}</h1>
  <p>{{ video?.description }}</p>
  <p><img :src="video?.image3" alt="Video thumbnail" /></p>
  <p><a :href="videoUrl" target="_blank">Watch video</a></p>
</template>
