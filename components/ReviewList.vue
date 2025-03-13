<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Reviews List -->
        <div v-else>
            <div v-if="paginatedReviews.length > 0">
               <!--{{ paginatedReviews }}--> 
                <ReviewCard v-for="review in paginatedReviews" :key="review.review_id" :review="review" />
            </div>
            <div v-else>
                <p>No hay reseñas para mostrar.</p>
            </div>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation" class="mt-4">
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
import { ref, computed, onMounted } from 'vue';

const userStore = useUserStore();
const reviews = ref([]);
const loading = ref(true);

const props = defineProps({
    userId: {
        type: String,
        required: true,
    },
});


// Pagination state
const currentPage = ref(1);
const itemsPerPage = 5; // Number of reviews per page
const visibleButtons = 5; // Number of visible pagination buttons

// Fetch reviews from the API
const fetchReviews = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/reviews', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify({id:props.userId}),
            },
        });

        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        reviews.value = data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    } finally {
        loading.value = false;
    }
};

// Pagination logic
const totalPages = computed(() => Math.ceil(reviews.value.length / itemsPerPage));

const paginatedReviews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return reviews.value.slice(start, end);
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

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
};

onMounted(() => {
    fetchReviews();
});
</script>

<style scoped>
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