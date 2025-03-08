<script setup>
defineProps(["video"]);

const videoUrl = (youtubeId) => {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};
</script>

<template>
  <div v-if="video">
    <p><img :src="video.image2" alt="thumbnail" /></p>
    <p>
      <NuxtLink :to="{ name: 'video-id', params: { id: video.id } }">{{
        video.title
      }}</NuxtLink>
      [<a :href="videoUrl(video.video_id)" target="_blank">Video</a>]
    </p>
  </div>
  <div v-else>Loading...</div>
</template>
