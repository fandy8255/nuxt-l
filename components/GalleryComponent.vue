<template>
    <div id="gallery-comp">
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Masonry Grid -->
        <div v-else>
            <div class="masonry-grid">
                <div v-for="(column, index) in columns" :key="index" class="masonry-column">
                    <NuxtLink v-for="product in paginatedProducts(column)" :key="product.id || product.product_id"
                        :to="`/tienda/${product.id}`">
                        <ImageComponent :imageUrl="getImageUrl(product)" :productName="product.product_name"
                            :likeCount="product.like_count || 0" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation" class="mt-4 bg-light">
                <ul class="pagination justify-content-center flex-wrap">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="changePage(1)">Primero</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
                    </li>
                    <li v-for="page in visiblePages" :key="page" class="page-item"
                        :class="{ active: page === currentPage }">
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="changePage(currentPage + 1)">Siguiente</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="changePage(totalPages)">Último</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user'; // Adjust the path as needed

const userStore = useUserStore();

const products = computed(() => {
    if (userStore.user_type === 'seller') {
        // Sort products by like_count in descending order
        return [...userStore.products].sort((a, b) => b.like_count - a.like_count);
    } else {
        // Return liked products for buyers
        return userStore.liked_products;
    }
});

const getImageUrl = (product) => {
    // Assuming the product_url is a relative path, adjust as needed
    return `https://lingerie.b-cdn.net/${product.product_url}`;
};

// Masonry grid logic
const columns = ref([]);
const numberOfColumns = ref(4); // Default number of columns

const distributeProductsIntoColumns = () => {
    const columnsArray = Array.from({ length: numberOfColumns.value }, () => []);
    products.value.forEach((product, index) => {
        const columnIndex = index % numberOfColumns.value;
        columnsArray[columnIndex].push(product);
    });
    columns.value = columnsArray;
};

// Adjust number of columns based on screen size
const updateColumns = () => {
    if (window.innerWidth < 768) {
        numberOfColumns.value = 2;
    } else if (window.innerWidth < 480) {
        numberOfColumns.value = 1;
    } else {
        numberOfColumns.value = 4;
    }
    distributeProductsIntoColumns();
};

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 2; // Number of items per page
const visibleButtons = 5; // Number of visible pagination buttons

const totalPages = computed(() => Math.ceil(products.value.length / (itemsPerPage * numberOfColumns.value)));
console.log('total page', totalPages)

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

const paginatedProducts = (column) => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return column.slice(start, end);
};

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
};

onMounted(() => {
    distributeProductsIntoColumns();
    window.addEventListener('resize', updateColumns);
});
</script>

<style scoped>
#gallery-comp {
    background: rgba(231, 231, 231, 0.589) !important;
    border-radius: 10px;
}

.masonry-grid {
    display: flex;
    gap: 16px;
    /* Spacing between columns */
    padding: 16px;
}

.masonry-column {
    flex: 1;
    /* Each column takes equal width */
    display: flex;
    flex-direction: column;
    gap: 16px;
    /* Spacing between images in a column */
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
    .masonry-grid {
        gap: 12px;
    }

    .masonry-column {
        gap: 12px;
    }
}

@media (max-width: 480px) {
    .masonry-grid {
        gap: 8px;
    }

    .masonry-column {
        gap: 8px;
    }
}

/* Pagination Styles */
.pagination {
    flex-wrap: wrap;
}

.page-item {
    margin: 2px;
}

.page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
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
        justify-content: center;
    }

    .page-link {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
    }
}
</style>