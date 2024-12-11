<template>
    <section>

        <div class="row d-lg-flex d-sm-block align-items-center justify-content-center"
            style="width: 90vw; align-items: start !important;">
            <!-- Thumbnails -->

            <div class="col-lg-3 col-sm-12 mb-sm-2 d-flex flex-column align-items-center justify-content-center"
                id="thumbnails-container">
                <Splide id="thumbnail-carousel" :options="thumbnailOptions" ref="thumbnailCarousel"
                    aria-label="Thumbnail Gallery" class="d-flex flex-lg-column flex-sm-row">
                    <SplideSlide v-for="(image, index) in images" :key="'thumb-' + index">
                        <img :src="image" :alt="'Thumbnail ' + index" class="thumbnail-img" />
                    </SplideSlide>
                </Splide>
            </div>
            <!-- Main Gallery -->
            <div class="col-lg-9 col-sm-12">
                <Splide id="main-carousel" :options="mainOptions" ref="mainCarousel" aria-label="Main Gallery">
                    <SplideSlide v-for="(image, index) in images" :key="index">
                        <img :src="image" :alt="'Image ' + index" />
                    </SplideSlide>
                </Splide>
            </div>


        </div>

    </section>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

// Props
defineProps({
    images: {
        type: Array as () => string[],
        required: true,
    },
});

// Refs
const mainCarousel = ref(null);
const thumbnailCarousel = ref(null);

// Options
const mainOptions = {
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
};

const thumbnailOptions = {
    arrows: true,
    fixedWidth: 100,
    fixedHeight: 180,
    gap: 10,
    heightRatio: 2.6,
    rewind: true,
    pagination: false,
    isNavigation: true,
    direction: 'ttb', // Vertical layout for large screens
    breakpoints: {
        768: {
            direction: 'ltr', // Horizontal layout for small screens
            fixedWidth: null,
            fixedHeight: 60,
            heightRatio: 0.6,
            gap: 5,
            perPage: 2
        },
    },
};

// Sync on mount
onMounted(() => {
    const main = mainCarousel.value?.splide;
    const thumbnails = thumbnailCarousel.value?.splide;

    if (main && thumbnails) {
        main.sync(thumbnails);
    }
});
</script>


<style scoped>
.splide__slide img {
    width: 100%;
    height: auto !important;
    /*max-height: 100vh !important;*/
    object-fit: cover;
}

ul {
    justify-content: center;
}

#thumbnail-carousel-list {
    margin-top: 50px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    height: 10vh !important;
}

li {
    height: fit-content !important;
}

.thumbnail-img {
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
}

#thumbnails-container {
    display: flex;
    align-items: start;
    justify-content: center;
    height: 100%;
}

.splide__list {
    width: 10vw !important;
}


@media (max-width: 768px) {
    #thumbnail-carousel .splide__list {
        flex-direction: row;

        /* Horizontal layout for small screens */
    }
}
</style>