<template>
    <div>
        <button v-if="isFollowing" @click="handleUnfollow" class="btn btn-danger">
            Unfollow
        </button>
        <button v-else @click="handleFollow" class="btn btn-primary">
            Follow
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'; // Update the path if needed

const props = defineProps({
    viewedUsername: {
        type: String,
        required: true, // The username of the profile being viewed
    },
});
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();

// Compute whether the logged-in user is following the viewed user
const isFollowing = computed(() =>
    userStore.followed.some(elem => elem.username === props.viewedUsername)
);

// Handle follow action
const handleFollow = async () => {
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`
            },
            body: JSON.stringify({
                follower: userStore.username,
                followed: props.viewedUsername,
            }),
        });

        if (response.ok) {
            const data = await response.json()
            let obj = {
                id: data.followed_id,
                username: props.viewedUsername,
                profile_picture: ""
            }
            userStore.followed.push(obj);
        }
    } catch (error) {
        console.error('Error following user:', error.message);
    }
};

// Handle unfollow action
const handleUnfollow = async () => {
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`
            },
            body: JSON.stringify({
                follower: userStore.username,
                followed: props.viewedUsername,
            }),
        });

        if (response.ok) {
            const index = userStore.followed.findIndex(elem => elem.username === props.viewedUsername);
            if (index > -1) userStore.followed.splice(index, 1);
        }
    } catch (error) {
        console.error('Error unfollowing user:', error.message);
    }
};
</script>

<style scoped>
/* Add custom styling here */
</style>