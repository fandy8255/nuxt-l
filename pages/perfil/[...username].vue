<template>
    <div class="container mt-5">
        <br>
        <br>
        <div class="row" v-if="user">
            <div class="col-4 p-2 text-center">
                <!-- Profile Picture -->
                <NuxtImg provider="bunny" :src="user.profile_picture" height="auto" width="300px" :quality="50" />
            </div>
            <div class="col-8">
                <!-- User Details -->
                <h2>{{ user.username }}</h2>
                <p><strong>Edad:</strong> {{ user.age }}</p>
                <p><strong>Descripción:</strong>
                    <textarea class="form-control" rows="4" disabled>{{ user.profile_description }}</textarea>
                </p>
                <p><strong>Tipo de Usuario:</strong> {{ user.user_type }}</p>
            </div>
        </div>
        <div v-else>
            <br>
            <br>
            No se encontró el usuario
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
//import { useUserStore } from '@/stores/user'; // Adjust path if necessary

// State
const user = ref(null);
const usernameSlug = ref('');
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();

const fetchData = async (usernameSlug) => {
    try {
        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/user?username=${usernameSlug}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        user.value = data;
    } catch (error) {
        console.error(error);
        user.value = null;
    }
};

// Check if the username is the authenticated user or another user
const loadUserData = () => {
    usernameSlug.value = useRoute().params.username[0];
    //console.log('1 store',userStore.username )
    //console.log('usernameslug',usernameSlug.value )
    if (usernameSlug.value === userStore.username) {
        console.log('fetched from store')
        // Use data from Pinia store for authenticated user
        user.value = {
            username: userStore.username,
            age: userStore.age,
            profile_description: userStore.profile_description,
            profile_picture: userStore.profile_picture,
            user_type: userStore.user_type,
        };
    } else {
        // Fetch data for other users
        fetchData(usernameSlug.value);
    }
};

onMounted(() => {
    loadUserData();
});
</script>


<style>
/* Additional styles for the component */
</style>