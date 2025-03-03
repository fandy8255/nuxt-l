<template>
    <div class="featured-articles mx-3">
      <h2 class="text-center mb-4 fw-bold">Featured Articles</h2>
      <div class="row gy-4 gy-lg-0">
        <div v-for="article in featuredArticles" :key="`featured_${article.title}`" class="col-sm-12 col-md-6 col-lg-4">
          <ArticleCard :date="article.date"
            :title="article.title"
            :category="article.category"
            :imgSrc="article.image"
            :articleDescription="article.description"
            :artPath="article.stem.split('/')[1]"
            :toc="article.body.toc.links"
            :cardHeight="'50vh'" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

import ArticleCard from '~/components/ArticleCard.vue';
  
  defineProps({
    featuredArticles: {
      type: Array,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .featured-articles {
    margin: 40px 0;
  }
  
  /*
  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #5a5a5a !important;
  }*/

  </style>