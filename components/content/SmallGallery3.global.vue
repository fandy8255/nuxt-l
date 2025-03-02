<template>
    <div class="gallery-grid" :style="{ gridTemplateColumns: `repeat(${picturesPerRow}, 1fr)` }">
        <div v-for="(image, index) in parsedImages" :key="index" class="gallery-item">
            <img :src="image" :alt="`Gallery image ${index + 1}`" class="gallery-image" loading="lazy" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// Define the props
const { images, picturesPerRow } = defineProps({
    images: {
        type: [Array, String], // Allow both Array and JSON string
        required: true,
    },
    picturesPerRow: {
        type: Number,
        default: 3, // Default to 3 pictures per row
    },
});

// Parse the images prop if it's a JSON string
const parsedImages = computed(() => {
    if (typeof images === 'string') {
        return JSON.parse(images);
    }
    return images;
});
</script>

<style scoped>
.gallery-grid {
    display: grid;
    gap: 16px;
    /* Adjust the gap between images */
    margin: 20px 0;
}

.gallery-item {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gallery-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
}

.gallery-image:hover {
    transform: scale(1.05);
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 2 images per row on tablets */
    }
}

@media (max-width: 480px) {
    .gallery-grid {
        grid-template-columns: repeat(1, 1fr);
        /* 1 image per row on mobile */
    }
}
</style>