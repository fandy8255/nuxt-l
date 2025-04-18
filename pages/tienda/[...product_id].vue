<template>
    <div class="container-fluid mt-2">
        <div v-if="loaded" class="row">
            <!-- Left Column: Product Details -->
            <div class="col-sm-12 col-lg-4 mt-5">
                <div class="container-xl">
                    <!-- Message Modal -->
                    <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />

                    <div class="product-details">
                        <!-- User Image and Like Button -->
                        <div class="d-flex mb-4">
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
                        <h2 class="product-name">{{ product.product_name }}</h2>
                        <p class="product-description">{{ product.product_description }}</p>

                        <!-- Product Category -->
                        <div class="product-info mb-3">
                            <h4 class="info-label">Categoría</h4>
                            <p class="info-value">{{ product.product_category }}</p>
                        </div>

                        <!-- Product Stock -->
                        <div class="product-info mb-3">
                            <h4 class="info-label">Stock/Cantidad</h4>
                            <p class="info-value">{{ product.product_stock }}</p>
                        </div>

                        <!-- Product Price -->
                        <div class="product-info mb-4">
                            <h4 class="info-label">Precio</h4>
                            <p class="info-value">${{ product.product_price }} {{ product.product_currency.toUpperCase()
                            }}</p>
                        </div>

                        <!-- Rating -->
                        <div class="rating mb-4">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                            <span class="rating-text">(4.0)</span>
                        </div>

                        <!-- Payment Info -->
                        <div class="payment-info mb-4">
                            <i class="fas fa-credit-card"></i>
                            <span class="payment-text">Métodos de Pago: Tarjeta de Crédito, PayPal</span>
                        </div>

                        <!-- Cancel Order or Order Component -->
                        <div v-if="userStore.user_type === 'buyer'">
                            <CancelOrder v-if="hasOrderForProduct" :orderId="getOrderIdForProduct"
                                :productId="product.id" @order-canceled="handleOrderCanceled"
                                @message="handleMessage" />
                            <OrderComponent v-else :product="product" :user="userStore.user_tok"
                                @submit-order="handleSubmitOrder" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Product Images -->
            <div class="col-sm-12 col-lg-8 p-2 mt-5">
                <SplideComponent :images="product.images" />
            </div>
        </div>
        <div v-else>
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
/*
import { useRoute } from 'vue-router';
import { useUserStore } from '~/stores/userStore'; // Adjust the path as needed
import CancelOrder from '~/components/CancelOrder.vue'; // Adjust the path as needed
import OrderComponent from '~/components/OrderComponent.vue'; // Adjust the path as needed
*/

const prodId = useRoute().params.product_id[0];
const product = ref({});
const likes = ref(0);
const loaded = ref(false);
const userStore = useUserStore();
const product_name = ref('');
const message = ref(null);

// Computed property to check if the user has an order for the current product
const hasOrderForProduct = computed(() => {
    if (!userStore.orders || !product.value.id) return false;

    // Check if any order in the user's orders array matches the current product ID
    return userStore.orders.some(order => order.product_id === product.value.id);
});

// Get the order ID for the current product
const getOrderIdForProduct = computed(() => {
    if (!userStore.orders || !product.value.id) return null;
    //return product.value.id
    const order = userStore.orders.find(order => order.product_id === product.value.id);
    return order ? order.order_id : null;
    //return order
});

// Handle the message event from the CancelOrder component
const handleMessage = (msg) => {
    message.value = msg;
};

// Clear the message
const clearMessage = () => {
    message.value = null;
};

// Handle the order-canceled event
const handleOrderCanceled = (orderId) => {
};

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
        product_name.value = result.data.product_name.toString();
        likes.value = result.data.like_count;
    } catch (error) {
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
                'X-User': JSON.stringify({
                    id: userStore.id,
                    user_type: userStore.user_type
                }),
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error('Failed to submit order');
        const result = await response.json();
        
        let item=result.result.results[0]

        item.product_id=product.value.id
        item.product_name=product.value.product_name
        item.product_owner_username=product.value.username
        item.product_url=product.value.product_url
        item.buyer_username=userStore.username
        item.product_owner_profile_picture=product.value.profile_picture
        item.order_id=item.id

        userStore.addToOrders(item)
        message.value = {
            success: true,
            text: 'Orden Creada',
        };
        
    } catch (error) {
        message.value = {
            failure: true,
            text: 'Orden No Pudo Ser Creada',
        };
    }
};

// Fetch product info on mount
onMounted(async () => {
    await fetchInfo(prodId).then(() => {
        loaded.value = true;

        useSeoMeta({
            title: `Latin Panty | Producto | ${product.value.product_name}`,
            description: `Descripción: ${product.value.product_description}`,
            robots: 'noindex',
        });
    });
});
</script>


<style scoped>
.container-fluid {
    padding: 20px;
}

.product-details {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-name {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
}

.product-description {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1.5rem;
}

.product-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.info-label {
    font-size: 1rem;
    font-weight: 600;
    color: #777;
    margin: 0;
}

.info-value {
    font-size: 1rem;
    color: #333;
    margin: 0;
}

.rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ffc107;
    font-size: 1.2rem;
}

.rating-text {
    color: #333;
    font-size: 1rem;
}

.payment-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: #333;
}

.payment-text {
    font-size: 1rem;
    color: #333;
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