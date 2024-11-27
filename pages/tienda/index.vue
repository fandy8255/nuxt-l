<template>
  <div>
    <!-- Product Listing -->
    <div class="container">
      <FilterComponent @update-products="updateProducts" />
    </div>
    <div class="container">
      <div class="row mt-5">
        <div v-for="(product, index) in paginatedProducts" :key="index" class="col-sm-12 col-lg-3">
        {{product.product_name}}
        
        <ProductCard :imgSrc="product.image" :productTitle="product.product_name"
            :productDescription="product.product_description"
            :prodPath="'/' + product.product_url"
            :productCategory="product.product_category"
            :productPrice="product.product_price"
            />
          
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(1)">First</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>
        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
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
</template>

<script setup>
import { ref, computed } from 'vue';

// State for products
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8; // Number of products per page
const visibleButtons = 5; // Number of visible pagination buttons

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
};

// Fetch products on component mount
await fetchProducts();

const updateProducts = (fetchedProducts) => {
      products.value = fetchedProducts;
      console.log("products-value:", products.value)
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
  const half = Math.floor(visibleButtons / 2);
  const startPage = Math.max(1, currentPage.value - half);
  const endPage = Math.min(totalPages.value, startPage + visibleButtons - 1);

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  return pages;
});

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