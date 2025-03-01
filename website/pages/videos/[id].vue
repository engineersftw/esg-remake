<script setup>
const { params } = useRoute();
const videoId = params.id;

const samplePage = {
  name: "sample",
  content: "Hello World!",
};

let pageContent;
if (videoId === "sample") {
  pageContent = samplePage.content;
} else {
  pageContent = "No content found";
}
</script>

<template>
  <h1>{{ pageContent }}</h1>
</template>
