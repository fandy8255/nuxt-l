<template>
    <div class="container mt-5">
        <div v-if="!userStore.logged_in" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <h1 class="text-center mb-4">User Dashboard</h1>
            <h1>Bienvenido {{ userStore.username }}!</h1>
            <!--
            <p>id: {{ userStore.id }}</p>
            <p>Age: {{ userStore.age }}</p>
            <p>User Type {{ userStore.user_type }}</p>
            <p>Email {{ userStore.email }}</p>
            <p>Profile Description: {{ userStore.profile_description }}</p>
            <img :src="userStore.profile_image" alt="Profile Image" />
            <p>Ubicación: {{ userStore.ubicacion }}</p>
            <p>products {{ userStore.products }}</p>
            <p>followers {{ userStore.followers }}</p>
            <p>followed {{ userStore.followed }}</p>
            <p>liked products: {{ userStore.liked_products }}</p>
            <p>feed {{ userStore.feed }}</p>
            <p>blocked users {{ userStore.blocked_users }}</p>
            <p>blocked by {{ userStore.blocked_by }}</p>
            <p>message count {{ userStore.message_count }}</p>-->
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(() => {
    userStore.fetchUserData();
});
</script>


<style scoped>
.card {
    border-radius: 12px;
}

.list-group-item {
    background-color: #f9f9f9;
    border: none;
}

.text-primary {
    font-weight: bold;
}

.shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>