<template>
    <div class="categories px-5">
      <h2 class="text-start">Categories</h2>
      <div class="row gy-4">
        <div v-for="(category, index) in categories" :key="index" class="col-sm-6 col-md-4 col-lg-3">
          <NuxtLink :to="`revista/category/${category.category.toLowerCase()}`" >
            <div class="category-card border rounded" :style="{ backgroundImage: `url(${category.image})` }">
            <div class="category-name text-light rounded">
              {{ category.category.toUpperCase() }}</div>
          </div>
          </NuxtLink>
          
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    categories: {
      type: Array,
      required: true,
    },
  });
  
  
  const emit = defineEmits(['select-category']);
  
  const selectCategory = (category) => {
    emit('select-category', category); // Emit the selected category to the parent
  };


  </script>
  
  <style scoped>

/*
 h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #5a5a5a
  }*/

  .categories {
    background: transparent;
    /*margin: 40px 0;*/
  }
  
  .category-card {
    position: relative;
    height: 200px; /* Adjust height as needed */
    background-size: cover;
    background-position: center;
    /*border-radius: 8px;*/
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .category-card:hover {
    transform: scale(1.05); /* Add a hover effect */
  }
  
  .category-name {
    background: rgba(128, 128, 128, 0.619);
    padding: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add text shadow for better readability */
  }
  </style>