<template>
    <div class="gallery-grid">
      <div v-for="(image, index) in JSON.parse(images)" :key="index" class="gallery-item">
        <img :src="image" :alt="`Gallery image ${index + 1}`" class="gallery-image" />
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    images: {
      type: Array,
      required: false,
    },
  });

  //console.log('images', images)
  </script>
  
  <style scoped>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }
  
  .gallery-item {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .gallery-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }
  
  .gallery-image:hover {
    transform: scale(1.05);
  }
  </style>