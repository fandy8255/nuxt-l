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

const userStore = useUserStore();

// Compute whether the logged-in user is following the viewed user
const isFollowing = computed(() =>
    userStore.followed.includes(props.viewedUsername)
);

// Handle follow action
const handleFollow = async () => {
    try {
        const response = await fetch(`/api/follow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                follower: userStore.username,
                followed: props.viewedUsername,
            }),
        });

        if (response.ok) {
            userStore.followed.push(props.viewedUsername);
        }
    } catch (error) {
        console.error('Error following user:', error.message);
    }
};

// Handle unfollow action
const handleUnfollow = async () => {
    try {
        const response = await fetch(`/api/unfollow`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                follower: userStore.username,
                followed: props.viewedUsername,
            }),
        });

        if (response.ok) {
            const index = userStore.followed.indexOf(props.viewedUsername);
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