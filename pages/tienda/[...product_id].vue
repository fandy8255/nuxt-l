<template>
    <div class="container-fluid mt-2">
        <div class="row w-100">
            <!-- Left Column: Product Details -->
            <div class="col-sm-12 col-lg-4 mt-5">
                <div class="container">
                    <div style="position: relative; top: 10px; left: 10px">
                        <!-- User Image and Like Button -->
                        <div class="d-flex">
                            <div class="row w-100">
                                <div class="col-6">
                                    <UserImgComponent v-if="loaded" :image="product.profile_picture"
                                        :username="product.username" />
                                </div>
                                <div class="col-6 text-end">
                                    <div class="lk d-flex justify-content-end align-items-end">
                                        <LikeButton v-if="loaded && product.user_id !== userStore.id"
                                            @click="handleClick" :likedProductId="product.id"
                                            :productOwnerId="product.user_id"
                                            :like_count="product ? parseInt(product.like_count) : 0" />
                                        <div v-else>
                                            <i class="fa-solid fa-heart"></i> {{ product.like_count }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Product Name and Description -->
                        <h2 class="mt-4 product-name">{{ product.product_name }}</h2>
                        <p class="product-description">{{ product.product_description }}</p>
                        <p class="product-category">{{ product.product_category }}</p>

                        <!-- Rating -->
                        <div class="rating mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                            <span>(4.0)</span>
                        </div>

                        <!-- Payment Info -->
                        <div class="payment-info mb-3">
                            <i class="fas fa-credit-card"></i> Payment Methods: Credit Card, PayPal
                        </div>

                        <!-- Order Component -->
                        <OrderComponent :product="product" :user="userStore.user_tok"
                            @submit-order="handleSubmitOrder" />
                    </div>
                </div>
            </div>

            <!-- Right Column: Product Images -->
            <div class="col-sm-12 col-lg-8 p-2 mt-5">
                <SplideComponent :images="product.images" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
/*
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore'
import UserImgComponent from '@/components/UserImgComponent.vue';
import LikeButton from '@/components/LikeButton.vue';
import SplideComponent from '@/components/SplideComponent.vue';
import OrderComponent from '@/components/OrderComponent.vue';*/

const prodId = useRoute().params.product_id[0];
const product = ref({});
const likes = ref(0);
const loaded = ref(false);
const userStore = useUserStore();

// Fetch product info
const fetchInfo = async (prodId) => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/getProducts?product_id=${prodId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        product.value = result.data;
        likes.value = result.data.like_count;
    } catch (error) {
        console.error('Error fetching product info:', error);
        product.value = {};
    }
};

// Handle like button click
const handleClick = () => {
    likes.value = likes.value + 1;
};

// Handle order submission
const handleSubmitOrder = async (orderData) => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error('Failed to submit order');
        const result = await response.json();
        console.log('Order submitted successfully:', result);
    } catch (error) {
        console.error('Error submitting order:', error);
    }
};

// Fetch product info on mount
onMounted(() => {
    fetchInfo(prodId).then(() => (loaded.value = true));
});

// SEO Meta
useSeoMeta({
    title: `Producto: ${product.product_name}`,
    description: `Descripción: ${product.product_description}`,
    robots: 'noindex',
});
</script>

<style scoped>
.container-fluid {
    padding: 20px;
}

.product-name {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.product-description {
    font-size: 1.1rem;
    color: #555;
    margin-top: 10px;
}

.product-category {
    font-size: 1rem;
    color: #777;
    margin-top: 5px;
}

.rating {
    color: #ffc107;
    font-size: 1.2rem;
}

.rating span {
    color: #333;
    margin-left: 5px;
}

.payment-info {
    font-size: 1rem;
    color: #333;
    margin-top: 10px;
}

.payment-info i {
    margin-right: 5px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.purchase-status-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.status-step {
    flex: 1;
    text-align: center;
    padding: 10px;
    border-bottom: 2px solid #ccc;
    color: #ccc;
}

.status-step.active {
    border-bottom-color: #007bff;
    color: #007bff;
}

.status-step.completed {
    border-bottom-color: #28a745;
    color: #28a745;
}

.stage-content {
    text-align: center;
}

.product-details {
    margin-bottom: 20px;
}

.product-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.quantity-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.btn {
    margin: 5px;
}
</style>