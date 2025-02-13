<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h1 class="text-center mb-4">Admin Dashboard</h1>
      <FileUploadFormCNT />
    </div>

    <div class="row">
      <!-- Users Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/users">
            <div class="card-body">
              <i class="fas fa-users fa-2x mb-3"></i>
              <h5 class="card-title">Users</h5>
              <p class="card-text fs-4">{{ stats.userCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Products Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/products">
            <div class="card-body">
              <i class="fas fa-box-open fa-2x mb-3"></i>
              <h5 class="card-title">Products</h5>
              <p class="card-text fs-4">{{ stats.productCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Threads Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/threads">
            <div class="card-body">
              <i class="fas fa-comments fa-2x mb-3 text-warning"></i>
              <h5 class="card-title">Threads</h5>
              <p class="card-text fs-4">{{ stats.threadCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Reported Products Card -->
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <div class="card-body">
            <i class="fas fa-exclamation-triangle fa-2x mb-3 text-danger"></i>
            <h5 class="card-title">Reported Products</h5>
            <p class="card-text fs-4">{{ stats.reportedProductCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/cntUsers">
            <div class="card-body">
              <i class="fas fa-users fa-2x mb-3"></i>
              <h5 class="card-title">CNT Users</h5>
              <p class="card-text fs-4">{{ stats.userCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/cntProducts">
            <div class="card-body">
              <i class="fas fa-users fa-2x mb-3"></i>
              <h5 class="card-title">CNT Products</h5>
              <p class="card-text fs-4">{{ stats.userCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <NuxtLink class="text-decoration-none" to="/ad/cntThreads">
            <div class="card-body">
              <i class="fas fa-users fa-2x mb-3"></i>
              <h5 class="card-title">CNT Threads</h5>
              <p class="card-text fs-4">{{ stats.userCount }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4 text-center">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const userStore= useUserStore()

const stats = ref({
  userCount: 0,
  productCount: 0,
  threadCount: 0,
  reportedProductCount: 0,
});

const errorMessage = ref("");

const fetchStats = async () => {
  const timestamp = Date.now().toString();
  const signature = await userStore.generateHMACSignature(timestamp);
  const user = await userStore.getUser();
  try {

    const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/ad/stats`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                },
            }
        );

    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    stats.value.userCount = data.data.total_users;
    stats.value.productCount = data.data.total_products;
    stats.value.threadCount = data.data.total_threads;
    stats.value.reportedProductCount = data.data.total_reports;

    if(data.data.value){
      console.log('has data')
    }

  } catch (err) {
    errorMessage.value = "Failed to load data. Please try again.";
  }
};

onMounted(fetchStats);
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}
</style>
