<template>
    <div class="image-container">
        <img :src="imageUrl" :alt="productName" class="product-image" />
        <div class="image-overlay">
            <span class="product-name text-light">{{ productName }}</span>
            <span class="like-count text-light">❤️ {{ likeCount }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    imageUrl: String,
    productName: String,
    likeCount: Number,
});
</script>

<style scoped>
.image-container {
    position: relative;
    width: 100%;
    /* Fixed width for images */
    /*height: auto;*/
    min-height: 20vh;
    max-height: 40vh;
    /* Dynamic height based on aspect ratio */
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f0f0f0;
    /* Fallback background */
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Crop from top to bottom */
    display: block;
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.product-name {
    /*font-weight: bold;*/
}

.like-count {
    font-size: 12px;
}
</style>