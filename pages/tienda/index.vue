<template>
    <div>
      <!-- Product Listing -->
      <div v-if="loading" class="text-center mt-5" style=" height: 600px !important; margin-top: 100px !important;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <div class="container">
          <FilterComponent @update-products="updateProducts" />
        </div>
  
        <div v-if="paginatedProducts" class="container">
          <div class="row mt-5">
            <div v-for="product in paginatedProducts" :key="product.id" class="col-sm-12 col-lg-3 p-2">
              <!--{{ product }}-->
              <ProductCard :product="product" :isAd="false" width="300px" />
            </div>
          </div>
        </div>
        <div v-else>
          <div class=" text-center mt-5" style=" height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
  
        <!-- Pagination Controls -->
        <div class="container">
          <nav aria-label="Page navigation" class="mt-4 bg-light">
            <ul class="pagination justify-content-start bg-light">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(1)">First</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
              </li>
              <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(totalPages)">Last</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  const userStore = useUserStore();
  
  const products = ref([]);
  const isAd = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = 4; // Number of products per page
  const loading = ref(true);
 
  const fetchProducts = async () => {

    const timestamp = Date.now().toString(); // Prevent replay attacks
    const signature = await userStore.generateHMACSignature(timestamp);

    const response = await fetch(
      `https://lingerie.fandy8255.workers.dev/api/getProducts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `HVAC ${signature}`,
          'X-Timestamp': timestamp,
        },
      }
    );
  
    const parsed = await response.json();

    const filteredProducts = parsed.data.results.filter(product => {
        
        return !userStore.blocked_users.some(
            blockedUser => blockedUser.username === product.username
        );
    });

    products.value = filteredProducts;
  };
  
  definePageMeta({
    middleware: ['auth']
  });
  
  
  onMounted(async () => {
    await fetchProducts().then(res => console.log('fetched')).finally(res => loading.value = false);
  });
  
  const updateProducts = (fetchedProducts) => {
    products.value = fetchedProducts;
    console.log("products updated", products.value);
  };
  
  // Computed properties
  const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.value.slice(start, end);
  });
  
  const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5; // Number of visible pagination buttons
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);
  
    // Adjust startPage and endPage if they go out of bounds
    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
      endPage = totalPages.value;
      startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }
  
    // Generate the range of pages
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
  
    return pages;
  });
  
  // Method to change page
  const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
      window.scrollTo(0, 0);
    }
  };
  </script>
  
  <style scoped>
  .pagination .page-item.active .page-link {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }
  
  .pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
  }
  
  .product_card {
    max-height: 60vh !important;
  }
  </style>