<template>
    <div>
        <button v-if="isLiked" @click="handleUnlike" class="lk-btn">
            <i class="fa-solid fa-heart"></i>
        </button>
        <button v-else @click="handleLike" class="lk-btn">
            <i class="fa-regular fa-heart"></i>
        </button>
        <span>{{ currentLikeCount }}</span>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    likedProductId: {
        type: String,
        required: true, 
    },
    productOwnerId: {
        type: String,
        required: true, 
    },
    like_count: {
        type: Number,
        required :true, 
    },
});

const userStore = useUserStore(); 

const isLiked = computed(() =>
    userStore.liked_products.includes(props.likedProductId)
);

const currentLikeCount = ref(props.like_count);


const handleLike = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                liked_product: props.likedProductId,
                liked_by: userStore.id, 
                liked_product_belongs_to: props.productOwnerId,
            }),
        });

        if (response.ok) {
            userStore.liked_products.push(props.likedProductId); 
            currentLikeCount.value += 1; 
        }
    } catch (error) {
    }
};


const handleUnlike = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/unlike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                liked_product: props.likedProductId,
                liked_by: userStore.id, 
            }),
        });

        if (response.ok) {
            const index = userStore.liked_products.indexOf(props.likedProductId);
            if (index > -1) {
                userStore.liked_products.splice(index, 1); 
                currentLikeCount.value -= 1; 
            }
        }
    } catch (error) {
        
    }
};
</script>

<style scoped>
.lk-btn {
    background: transparent;
    border: none;
}
</style>