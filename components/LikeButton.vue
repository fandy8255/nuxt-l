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
        required: true, // The ID of the product being liked
    },
    productOwnerId: {
        type: String,
        required: true, // The ID of the user who owns the product
    },
    like_count: {
        type: Number,
        required :true, // The initial like count
    },
});

const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore(); // Assume userStore contains the logged-in user's info

// Reactive like count


// Check if the product is already liked by the logged-in user
const isLiked = computed(() =>
    userStore.liked_products.includes(props.likedProductId)
);

const currentLikeCount = ref(props.like_count);

console.log('propslike count', props.like_count)

// Handle like action
const handleLike = async () => {
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            },
            body: JSON.stringify({
                liked_product: props.likedProductId,
                liked_by: userStore.id, // Logged-in user's ID
                liked_product_belongs_to: props.productOwnerId,
            }),
        });

        if (response.ok) {
            userStore.liked_products.push(props.likedProductId); // Update local state
            currentLikeCount.value += 1; // Increment like count
        }
    } catch (error) {
        console.error('Error liking product:', error.message);
    }
};

// Handle unlike action
const handleUnlike = async () => {
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/unlike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            },
            body: JSON.stringify({
                liked_product: props.likedProductId,
                liked_by: userStore.id, // Logged-in user's ID
            }),
        });

        if (response.ok) {
            const index = userStore.liked_products.indexOf(props.likedProductId);
            if (index > -1) {
                userStore.liked_products.splice(index, 1); // Update local state
                currentLikeCount.value -= 1; // Decrement like count
            }
        }
    } catch (error) {
        console.error('Error unliking product:', error.message);
    }
};
</script>

<style scoped>
.lk-btn {
    background: transparent;
    border: none;
}
</style>