<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Admin Dashboard</h1>
    <div class="row">
      <!-- Users Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink to="/ad/users">
            <div class="card-body">
              <i class="fas fa-users fa-3x mb-3 text-primary"></i>
              <h5 class="card-title">Users</h5>
              <p class="card-text fs-4">{{ userCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Products Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <div class="card-body">
            <i class="fas fa-box-open fa-3x mb-3 text-success"></i>
            <h5 class="card-title">Products</h5>
            
            <p class="card-text fs-4">{{ productCount }}</p>
          </div>

        </div>
      </div>

      <!-- Threads Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <div class="card-body">
            <i class="fas fa-comments fa-3x mb-3 text-warning"></i>
            <h5 class="card-title">Threads</h5>
            <p class="card-text fs-4">{{ threadCount }}</p>
          </div>
        </div>
      </div>

      <!-- Reported Products Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <div class="card-body">
            <i class="fas fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
            <h5 class="card-title">Reported Products</h5>
            <p class="card-text fs-4">{{ reportedProductCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Example data (replace with actual data from your backend)
const userCount = 120;
const productCount = 450;
const threadCount = 85;
const reportedProductCount = 12;
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}
</style>