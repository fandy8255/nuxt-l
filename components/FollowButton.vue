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
import { computed } from 'vue';

const props = defineProps({
    viewedUsername: {
        type: String,
        required: true,
    },
});

const userStore = useUserStore();
const isFollowing = computed(() =>
    userStore.followed.some(elem => elem.username === props.viewedUsername)
);

const handleFollow = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
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

    }
};


const handleUnfollow = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
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
    }
};
</script>

<style scoped></style>