<!-- components/TopUsersList.vue -->
<template>
    <div class="container mb-4">
        <!-- Most Followed Users Section -->
        <div class="card mb-2 p-2 border-none">
            <div class="card-head mt-3">
                <h4 class="lead fw-bold ms-4">Usuarios más seguidos</h4>
            </div>
            <div class="card-body">
                <ul class="list-unstyled">
                    <li v-for="user in mostFollowed" :key="user.id" class="container border-bottom rounded p-1 mt-1">
                        <NuxtLink class="text-decoration-none" :to="'/perfil/' + user.username">
                            <UserImgComponent :image="user.profile_picture" :username="user.username" />
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card mb-2 p-2 border-none">
            <div class="card-head mt-3">
                <h4 class="lead fw-bold ms-4">Usuarios Nuevos</h4>
            </div>
            <div class="card-body">
                <ul class="list-unstyled">
                    <li v-for="user in newestUsers" :key="user.id" class="container border-bottom rounded p-1 mt-1">
                        <NuxtLink class="text-decoration-none" :to="'/perfil/' + user.username">
                            <UserImgComponent :image="user.profile_picture" :username="user.username" />
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Reactive state for most followed and newest users
const mostFollowed = ref([]);
const newestUsers = ref([]);

// Runtime config for API key
const runtimeConfig = useRuntimeConfig();

// Fetch function to get top users
async function fetchTopUsers() {
    try {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/top-users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
            },
        });

        const result = await response.json();

        if (result) {
            // Assign the arrays directly from the response
            mostFollowed.value = result.most_followed;
            newestUsers.value = result.newest_users;
        }
    } catch (error) {
        console.error('Error fetching top users:', error.message);
    }
}

// Fetch data when the component is mounted
onMounted(() => {
    fetchTopUsers();
});
</script>

<style scoped>
/* Add custom styles if needed */
.container {
    max-width: 800px;
    margin: 0 auto;
}

h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

.list-unstyled {
    padding-left: 0;
    list-style: none;
}

.mb-3 {
    margin-bottom: 1rem;
}

.mb-5 {
    margin-bottom: 3rem;
}
</style>