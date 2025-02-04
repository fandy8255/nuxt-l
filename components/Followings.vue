<!-- components/UserFollowList.vue -->
<template>
    <div class="card mb-4 p-3 border-none">
        <!-- Buttons for Followers and Followed -->
        <div class="d-flex justify-content-around mb-3">
            <button class="btn btn-outline-primary w-50 me-2" :class="{ active: showFollowers }"
                @click="showFollowers = true">
                Seguidores
            </button>
            <button class="btn btn-outline-primary w-50 ms-2" :class="{ active: !showFollowers }"
                @click="showFollowers = false">
                Siguiendo
            </button>
        </div>

        <!-- List of Followers or Followed Users -->
        <div class="card-body p-0">
            <ul class="list-unstyled" :class="{ 'overflow-y-auto': (showFollowers ? followers : followed).length > 0 }"
                style="max-height: 300px;">
                <li v-for="user in (showFollowers ? followers : followed)" :key="user.id"
                    class="container border-bottom rounded p-2 mt-1">
                    <NuxtLink class="text-decoration-none" :to="'/perfil/' + user.username">
                        <UserImgComponent :image="user.profile_picture" :username="user.username" />
                    </NuxtLink>
                </li>
            </ul>

            <!-- Loading State -->
            <div v-if="loading" class="text-center mt-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && (showFollowers ? followers : followed).length === 0"
                class="text-center mt-3 text-muted">
                {{ showFollowers ? 'No tienes seguidores.' : 'No estás siguiendo a nadie.' }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Reactive state
const followers = ref([]); // List of followers
const followed = ref([]); // List of followed users
const showFollowers = ref(true); // Toggle between followers and followed
const loading = ref(false); // Loading state

// Fetch followers

/*
async function fetchFollowers() {
    try {
        loading.value = true;
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/followers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
        });

        const result = await response.json();
        if (result?.followers) {
            followers.value = result.followers;
        }
    } catch (error) {
        console.error('Error fetching followers:', error.message);
    } finally {
        loading.value = false;
    }
}

// Fetch followed users
async function fetchFollowed() {
    try {
        loading.value = true;
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/followed', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
        });

        const result = await response.json();
        if (result?.followed) {
            followed.value = result.followed;
        }
    } catch (error) {
        console.error('Error fetching followed users:', error.message);
    } finally {
        loading.value = false;
    }
}
*/
const userStore = useUserStore();

onMounted(() => {
    followers.value=userStore.followers
    followed.value=userStore.followed
});

</script>

<style scoped>

.card {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary.active {
    background-color: #0d6efd;
    color: white;
}

.overflow-y-auto {
    overflow-y: auto;
}

.list-unstyled {
    padding-left: 0;
    list-style: none;
}

.border-bottom {
    border-bottom: 1px solid #dee2e6;
}

.text-decoration-none {
    text-decoration: none;
}

.text-muted {
    color: #6c757d;
}
</style>