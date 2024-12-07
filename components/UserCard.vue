<template>
    <div class="card border-1 my-2">
      <div class="card-body bg-white p-3 text-center">
        <h5>{{ username }}</h5>
        <p>{{ profileDescription? profileDescription.slice(0, 80): 'no profile description' }}...</p>
        <p><strong>Age:</strong> {{ age }}</p>
        <span v-if="verified" class="badge bg-success">Verified</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const { username, profileDescription, age, verified } = defineProps([
    "username",
    "profileDescription",
    "age",
    "verified",
  ]);
  </script>
  
  <style scoped>
  .card-body {
    border-radius: 5px;
    background: #f8f9fa;
  }
  </style>