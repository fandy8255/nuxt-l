<template>
  <div>
    <!-- Product Listing -->
    <div class="row mt-5">
      <div v-for="(product, index) in paginatedProducts" :key="index" class="col">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ product.product_name }}</h5>
            <!--<p class="card-text">{{ product.comment }}</p> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>
        <li 
          v-for="page in totalPages" 
          :key="page" 
          class="page-item" 
          :class="{ active: page === currentPage }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State for products
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3; // Number of products per page

// Fetch products from your Cloudflare Worker
const fetchProducts = async () => {
  const response = await fetch(
    `https://lingerie.fandy8255.workers.dev/api/getProducts`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const parsed = await response.json();
  products.value = parsed.data.results;
  console.log("products",products.value)
};

// Fetch products on component mount
await fetchProducts();

// Computed properties
const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

console.log('paginated prods', paginatedProducts.value)

// Methods
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
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
</style>