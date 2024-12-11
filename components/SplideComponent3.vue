<template>
    <section>

        <div class="row d-lg-flex d-sm-block">
            <div class="col-lg-3 col-sm-12 mb-sm-2"
                id="thumbnails-container">
                <!-- Thumbnail Gallery -->
                <Splide id="thumbnail-carousel" :options="thumbnailOptions" ref="thumbnailCarousel"
                    aria-label="Thumbnail Gallery" class="d-flex flex-lg-column flex-sm-row ">
                    <SplideSlide v-for="(image, index) in images" :key="'thumb-' + index">
                        <img :src="image" :alt="'Thumbnail ' + index" class="thumbnail-img" />
                    </SplideSlide>
                </Splide>
            </div>
            <div class="col-lg-9 col-sm-12">
                <!-- Main Gallery -->
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

<style>
.splide__slide img {

    width: 100%;
    max-height: 80vh !important;
    object-fit: cover;
}

.thumbnail-img {
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
}

#main-carousel{
    border-top: 2px solid rgb(103, 103, 103);
    border-bottom: 2px solid rgb(103, 103, 103);
    /*border-radius: 10px;*/
    /*background: rgba(243, 243, 243, 0.49);*/
}

li {
    align-items: center ;
    align-self: center  ;
    justify-content: center  ;
    justify-self: center;
    height: fit-content !important;
}

#thumbnail-carousel-list {
    margin:auto !important;
    justify-content: center  ;
    align-items: center  ;
    justify-self: center;
    height: fit-content;
}

#thumbnail-carousel-track{
    display: block !important;
    /*height: 80vh !important;*/
    align-items: center !important  ;
    align-self: center !important ;
    justify-content: center !important  ;
    justify-self: center !important;
}

#thumbnails-container {
    align-items: center  ;
    align-self: center  ;
    justify-content: center  ;
    justify-self: center ;
    padding: 0;
}
</style>