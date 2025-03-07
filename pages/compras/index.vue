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
            <div class="container-fluid d-flex justify-content-center mt-4">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Order Status</th>
                            <th>Payment Method</th>
                            <th>Product Owner</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(order, index) in orders" :key="index">
                            <td>
                                <small>{{ order.order_id }}</small>
                            </td>
                            <td>{{ order.product_name }}</td>
                            <td>{{ order.quantity }}</td>
                            <td>${{ order.total_price }}</td>
                            <td>{{ order.order_status }}</td>
                            <td>{{ order.payment_method }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img :src="order.product_owner_profile_picture" alt="Profile Picture"
                                        class="img-thumbnail rounded-circle me-2" style="width: 40px; height: 40px;">
                                    <span>{{ order.product_owner_username }}</span>
                                </div>
                            </td>
                            <td>{{ new Date(order.created_at).toLocaleDateString('en-GB') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const loading = ref(true);

/*
definePageMeta({
    middleware: ["auth"] // Ensure the user is authenticated
});
*/
useSeoMeta({
    title: 'My Orders',
    description: 'View your placed orders',
    robots: 'noindex', // Prevent search engines from indexing this page
});

const fetchOrders = async () => {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const userStore = useUserStore();
    const signature = await userStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    });

    const parsed = await response.json();
    orders.value = parsed;
};

onMounted(async () => {
    await fetchOrders().finally(() => (loading.value = false));
});
</script>

<style scoped>
.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
    border-top: 2px solid #dee2e6;
}

.img-thumbnail {
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    max-width: 100%;
    height: auto;
}
</style>