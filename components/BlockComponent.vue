<template>
    <div>
        <button v-if="isBlocked" @click="handleUnblock" class="btn btn-danger">
            Desbloquear
        </button>
        <button v-else @click="handleBlock" class="btn btn-warning">
            Bloquear
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

const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();


const isBlocked = computed(() =>
    userStore.blocked_users.some(elem => elem.username === props.viewedUsername)
);

const isFollowing = computed(() =>
    userStore.followed.some(elem => elem.username === props.viewedUsername)
);

const handleBlock = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        if(isFollowing){
            await handleUnfollow()
        }

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/block-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                blocked_by: userStore.username,
                blocked_user: props.viewedUsername,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            let obj = {
                id: data.blocked_user_id,
                username: props.viewedUsername,
                profile_picture: ""
            };
            userStore.blocked_users.push(obj); 
            const filtered=userStore.feed.filter(elem=>elem.username !== props.viewedUsername)
            userStore.feed=filtered
        }
    } catch (error) {
        
    }
};

const handleUnblock = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/unblock-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                blocked_by: userStore.username,
                blocked_user: props.viewedUsername,
            }),
        });

        if (response.ok) {
            const index = userStore.blocked_users.findIndex(elem => elem.username === props.viewedUsername);
            if (index > -1) userStore.blocked_users.splice(index, 1); 
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

<style scoped>

.btn-warning {
    background-color: #ffc107;
    border-color: #ffc107;
    color: #000;
}

.btn-warning:hover {
    background-color: #e0a800;
    border-color: #d39e00;
}

.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}
</style>