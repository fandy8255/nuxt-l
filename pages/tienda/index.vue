<template>
    <div>
        <!-- Product Listing -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
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
                        <ProductCard :product="product" :isAd="false" width="300px" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="container">
                <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center flex-wrap">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(1)">First</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)">Prev</button>
                        </li>
                        <li v-for="page in visiblePages" :key="page" class="page-item"
                            :class="{ active: page === currentPage }">
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
const currentPage = ref(1);
const itemsPerPage = 4;
const loading = ref(true);

useSeoMeta({
  title: 'Latin Panty | Tienda',
  description: 'Latin Panty | Tienda',
  robots: 'noindex', 
});


const fetchProducts = async () => {
    const timestamp = Date.now().toString();
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
};

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5;
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    return pages;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
/* Pagination Styles */
.pagination {
    flex-wrap: wrap; /* Allow pagination items to wrap on small screens */
}

.page-item {
    margin: 2px; /* Add spacing between pagination items */
}

.page-link {
    padding: 0.5rem 0.75rem; /* Adjust padding for smaller screens */
    font-size: 0.875rem; /* Reduce font size for smaller screens */
}

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

@media (max-width: 900px) {
    .pagination {
        justify-content: center; /* Center pagination on small screens */
    }

    .page-link {
        padding: 0.375rem 0.5rem; /* Further reduce padding for very small screens */
        font-size: 0.75rem; /* Further reduce font size for very small screens */
    }

    .product_card{
        max-height: 100vh !important;
    }
}

.product_card {
    max-height: 60vh;
}
</style>