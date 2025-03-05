<template>
    <div class="categories-slider px-5">
        <h2 class="text-start">Categorías</h2>
        <Splide :options="splideOptions" aria-label="Categorías">
            <SplideSlide v-for="(category, index) in categories" :key="index">
                <NuxtLink :to="`/revista/category/${category.category.toLowerCase()}`">
                    <div class="img-fluid category-card border rounded" :style="{ backgroundImage: `url(${category.image})` }">
                        <div class="category-name text-light rounded">
                            {{ category.category.toUpperCase() }}
                        </div>
                    </div>
                </NuxtLink>
            </SplideSlide>
        </Splide>
    </div>
</template>

<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

defineProps({
    categories: {
        type: Array,
        required: true,
    },
});

const splideOptions = {
    type: 'loop', // Enable looping
    perPage: 4, // Number of slides per page
    gap: '1rem', // Gap between slides
    pagination: false, // Disable default pagination
    breakpoints: {
        1024: {
            perPage: 3, // Adjust for smaller screens
        },
        768: {
            perPage: 2, // Adjust for tablets
        },
        640: {
            perPage: 1, // Adjust for mobile
        },
    },
};
</script>

<style scoped>
.categories-slider {
    background: transparent;
    margin: 40px 0;
}

.category-card {
    position: relative;
    height: 200px;
    /* Adjust height as needed */
    background-size: cover;
    background-position: center;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.category-card:hover {
    transform: scale(1.05);
    /* Add a hover effect */
}

.category-name {
    background: rgba(128, 128, 128, 0.619);
    padding: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    /* Add text shadow for better readability */
}

/* Splide custom styles */
.splide__arrow {
    background: rgba(0, 0, 0, 0.5);
    opacity: 0.8;
}

.splide__arrow:hover {
    background: rgba(0, 0, 0, 0.8);
}

.splide__pagination {
    bottom: -20px;
}

.splide__pagination__page.is-active {
    background: #000;
}
img{
    width: 60% !important;
}
</style>