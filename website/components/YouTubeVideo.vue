<script setup>
defineProps(["video"]);

const videoUrl = (youtubeId) => {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};
</script>

<template>
  <span v-if="video">
    <h1>{{ video?.title }}</h1>
    <p>{{ video?.description }}</p>
    <p><img :src="video?.image3" alt="Video thumbnail" /></p>
    <p><a :href="videoUrl(video?.video_id)" target="_blank">Watch video</a></p>
  </span>
  <span v-else>Loading...</span>
</template>
