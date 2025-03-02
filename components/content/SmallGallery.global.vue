<template>
    <div>
        <!-- Gallery Grid -->
        <div class="gallery-grid" :style="{ gridTemplateColumns: `repeat(${picturesPerRow}, 1fr)` }">
            <div v-for="(image, index) in parsedImages" :key="index" class="gallery-item" @click="openLightbox(index)">
                <img :src="image" :alt="`Gallery image ${index + 1}`" class="gallery-image" loading="lazy" />
            </div>
        </div>

        <!-- Lightbox Component -->
        <vue-easy-lightbox :visible="visible" :imgs="parsedImages" :index="index" @hide="handleHide" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';

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

// Lightbox state
const visible = ref(false);
const index = ref(0);

// Open lightbox at a specific index
const openLightbox = (idx) => {
    index.value = idx;
    visible.value = true;
};

// Close lightbox
const handleHide = () => {
    visible.value = false;
};
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
    cursor: pointer;
    /* Indicate that the image is clickable */
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