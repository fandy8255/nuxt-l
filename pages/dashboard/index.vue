<template>
    <div id="main" class="container mt-5">
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else>
            <h2 class="text-start mb-4">Tu Tablero</h2>
           <!-- <h1>Bienvenido {{ userStore.username }}!</h1>-->

            <!-- Bootstrap 5 Tabs -->
            <ul class="nav nav-tabs mb-4" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders"
                        type="button" role="tab" aria-controls="orders" aria-selected="true">
                        Pedidos
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews"
                        type="button" role="tab" aria-controls="reviews" aria-selected="false">
                        Reseñas
                    </button>
                </li>
            </ul>

            
            <!-- Tab Content -->
            <div class="tab-content" id="dashboardTabsContent">
                <!-- Orders Tab -->
                <div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">
                    <Orders />
                </div>

                <!-- Reviews Tab -->
                <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                    <Reviews />
                </div>
            </div>

            <!-- Gallery Component -->
            <h2 class="text-start mb-4">{{userStore.user_type==='buyer'? 'Tu Wishlist' : ' Tus Productos'}}</h2>
            <GalleryComponent />

            <h2 v-if="userStore.user_type==='seller' " class="text-start mb-4">Tu Entrevista</h2>
            <InterviewComponent v-if="userStore.user_type==='seller' " />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userStore = useUserStore();
const loading = ref(true);

onMounted(async () => {
    await userStore.fetchUserData();
    loading.value = false;
});

useSeoMeta({
    title: 'Dashboard',
    description: 'Dashboard',
    robots: 'noindex',
});
</script>

<style scoped>
#main {
    margin-top: 40px;
}

/* Tab Styling */
.nav-tabs {
    /*border-bottom: 2px solid #dee2e6;*/
}

.nav-tabs .nav-link {
    color: #495057;
    background-color: #f8f9fa;
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
    background-color: #e9ecef;
}

.nav-tabs .nav-link.active {
    color: #0d6efd;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
}

/* Tab Content Styling */
.tab-content {
    padding: 20px;
    /* border: 1px solid #dee2e6;
    border-top: none;
    border-radius: 0 0 0.25rem 0.25rem;*/
    background-color: #fff;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .nav-tabs .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }

    .tab-content {
        padding: 15px;
    }
}

@media (max-width: 576px) {
    .nav-tabs .nav-link {
        padding: 0.5rem;
        font-size: 0.8125rem;
    }

    .tab-content {
        padding: 10px;
    }
}
</style>