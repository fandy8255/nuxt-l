<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="container-fluid" v-else>
            <div class="container-fluid d-flex justify-content-center">
                <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />

                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Método de Pago</th>
                            <th>{{ userStore.user_type === 'seller' ? 'Comprador' : 'Vendedor' }}</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in paginatedOrders" :key="order.id">
                            <td>
                                <ProductImgComponent :image="order.product_url ? order.product_url : ''"
                                    :username="order.product_name" :id="order.product_id" />
                            </td>
                            <td>
                                {{ order.quantity }}
                            </td>
                            <td>${{ order.total_price }}</td>
                            <td>{{ order.order_status }}</td>
                            <td>{{ order.payment_method }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <UserImgComponent :image="userStore.user_type === 'seller' ?
                                        (order.buyer_profile_picture || '/assets/images/panty-icon.jpg') :
                                        (order.product_owner_profile_picture || '/assets/images/panty-icon.jpg')"
                                        :username="userStore.user_type === 'seller' ?
                                            order.buyer_username :
                                            order.product_owner_username" />
                                </div>
                            </td>
                            <td>{{ new Date(order.created_at).toLocaleDateString('en-GB') }}</td>
                            <td style="height: 75.5px;">
                                <!-- Render CancelOrder for buyers if order_status is 'pending' -->
                                <CancelOrder v-if="userStore.user_type === 'buyer' && order.order_status === 'pending'"
                                    :orderId="order.order_id" :productId="order.product_id"
                                    @order-canceled="handleOrderCanceled" @message="handleMessage" />

                                <!-- Render CancelOrder and AcceptOrder for sellers if order_status is 'pending' -->
                                <div class="d-flex gap-1" v-if="userStore.user_type === 'seller' && order.order_status === 'pending'">
                                    <CancelOrder :orderId="order.order_id" :productId="order.product_id"
                                        @order-canceled="handleOrderCanceled" @message="handleMessage" />
                                    <AcceptOrder v-if="order.order_status === 'pending'" :orderId="order.order_id"
                                        :productId="order.product_id" @order-accepted="handleOrderAccepted"
                                        @message="handleMessage" />
                                </div>

                                <!-- Render SubmitReview for buyers if order_status is 'accepted' and no review exists -->
                                <SubmitReview
                                    v-if="userStore.user_type === 'buyer' && order.order_status === 'accepted' && !hasReviewForOrder(order.order_id) && !hasReviewForUser(order.seller_id)"
                                    :orderId="order.order_id" :reviewedUserId="order.seller_id"
                                    @review-submitted="handleReviewSubmitted" @message="handleMessage" />
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

const orders = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const message = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 2; // Number of orders per page
const visibleButtons = 5; // Number of visible pagination buttons

// Handle the message event
const handleMessage = (msg) => {
    message.value = msg;
};

// Clear the message
const clearMessage = () => {
    message.value = null;
};

// Handle the order-canceled event
const handleOrderCanceled = (orderId) => {
    orders.value = orders.value.filter(order => order.order_id !== orderId);
};

// Handle the order-accepted event
const handleOrderAccepted = (orderId) => {
    const order = orders.value.find(order => order.order_id === orderId);
    if (order) {
        order.order_status = 'accepted';
    }
};

// Handle the review-submitted event
const handleReviewSubmitted = (reviewId) => {
    const order = orders.value.find(order => order.order_id === reviewId);
    if (order) {
        order.has_review = true; // Mark the order as reviewed
    }
};

// Check if a review exists for the order in the userStore.reviews array
const hasReviewForOrder = (orderId) => {
    return userStore.reviews.some(review => review.order_id === orderId);
};

const hasReviewForUser = (sellerId) => {
    return userStore.reviews.some(review => review.reviewed_user === sellerId);
};

// Pagination logic
const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));
const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.value.slice(start, end);
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
    // Fetch orders from the user store
    orders.value = userStore.orders;

    // Mark orders as reviewed if a review exists in the userStore.reviews array
    orders.value = orders.value.map(order => ({
        ...order,
        has_review: hasReviewForOrder(order.order_id),
    }));

    loading.value = false;
});
</script>

<style scoped>
/* Ensure table cells are vertically centered */
.table td {
    vertical-align: middle !important;
    height: 75px;
}

/* Ensure the actions column (buttons) are aligned properly */
.table td:last-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Ensure the UserImgComponent and ProductImgComponent are aligned properly */
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