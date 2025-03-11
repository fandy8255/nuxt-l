<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Reviews Table -->
        <div class="container-fluid" v-else>
            <div class="container-fluid d-flex justify-content-center mt-4">
                <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />

                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Reseña</th>
                            <th>Calificación</th>
                            <th>{{ userStore.user_type === 'seller' ? 'Comprador' : 'Vendedor' }}</th>
                            <th>Fecha</th>
                            <th>Respuesta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="review in paginatedReviews" :key="review.id">
                            <td>
                                <div>
                                    <strong>{{ review.review_title }}</strong>
                                    <!--<p>{{ review.review_description }}</p>-->
                                </div>
                            </td>
                            <td>
                                {{ review.rating }} ⭐
                            </td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <UserImgComponent :image="userStore.user_type === 'seller' ?
                                        (review.reviewed_by_profile_picture || '/assets/images/panty-icon.jpg') :
                                        (review.reviewed_user_profile_picture || '/assets/images/panty-icon.jpg')"
                                        :username="userStore.user_type === 'seller' ?
                                            review.reviewed_by_username :
                                            review.reviewed_user_username" />
                                </div>
                            </td>
                            <td>{{ new Date(review.created_at).toLocaleDateString('en-GB') }}</td>
                            <td>
                                <div v-if="review.review_reply">
                                    <strong>Respuesta:</strong>
                                    <p>{{ review.review_reply }}</p>
                                </div>
                                <div v-else>
                                    <p>Sin respuesta</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div class="container">
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const reviews = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const message = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 5; // Number of reviews per page
const visibleButtons = 5; // Number of visible pagination buttons

// Handle the message event
const handleMessage = (msg) => {
    message.value = msg;
};

// Clear the message
const clearMessage = () => {
    message.value = null;
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
    }
};

onMounted(async () => {
    // Fetch reviews from the user store
    reviews.value = userStore.reviews;

    // Mark loading as false
    loading.value = false;
});
</script>

<style scoped>
/* Ensure table cells are vertically centered */
.table td {
    vertical-align: middle !important;
    height: 75px;
}

/* Ensure the UserImgComponent is aligned properly */
.d-flex.align-items-center {
    display: flex;
    align-items: center;
}

/* Optional: Add some padding to the table cells for better spacing */
.table td {
    padding: 0.75rem;
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