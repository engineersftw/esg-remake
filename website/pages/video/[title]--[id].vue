<script setup>
import YouTubeVideo from "~/components/YouTubeVideo.vue";
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

  video.value = data;
}

onMounted(() => {
  getVideo();
});
</script>

<template>
  <YouTubeVideo :video="video" />
</template>
