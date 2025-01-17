<template>
    <div class="container mt-5">
        <div v-if="!userStore.logged_in" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <h1 class="text-center mb-4">User Dashboard</h1>
            <h1>Welcome, {{ userStore.username }}!</h1>
            <p>id: {{ userStore.id }}</p>
            <p>Age: {{ userStore.age }}</p>
            <p>User Type {{ userStore.user_type }}</p>
            <p>Email {{ userStore.email }}</p>
            <p>Profile Description: {{ userStore.profile_description }}</p>
            <img :src="userStore.profile_image" alt="Profile Image" />
            <p>Ubicación: {{ userStore.ubicacion }}</p>
            <p>products {{ userStore.products }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

onMounted(() => {
    userStore.fetchUserData();
});
</script>


<style scoped>
/* Add optional custom styles for the dashboard */
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