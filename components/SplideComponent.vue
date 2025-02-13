<template>
    <section>
        <div class="row">
            <!-- Main Gallery -->
            <div class="col-12">
                <Splide id="main-carousel" :options="mainOptions" ref="mainCarousel" aria-label="Main Gallery">
                    <SplideSlide v-for="(image, index) in images" :key="'main-' + index" >
                        <div class="container splide-li-slide d-flex">
                          <NuxtImg provider="bunny" :src="image.image_url" height="700px" width="auto" :quality="60" placeholder="/assets/images/panty-icon.png" />
                        </div>
                    </SplideSlide>
                </Splide>
            </div>

            <!-- Thumbnail Gallery -->
            <div class="col-12 mt-2">
                <Splide id="thumbnail-carousel" :options="thumbnailOptions" ref="thumbnailCarousel"
                    aria-label="Thumbnail Gallery">
                    <SplideSlide v-for="(image, index) in images" :key="'thumb-' + index">
                       <NuxtImg provider="bunny" :src="image.image_url" height="auto" width="60px" :quality="50" placeholder="/assets/images/panty-icon.png" />
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
        type: Array as () => Object[],
        required: true,
    },
});

const mainCarousel = ref(null);
const thumbnailCarousel = ref(null);

const mainOptions = {
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
};

const thumbnailOptions = {
    /*fixedWidth: 100,*/
    /*width:AuthenticatorAssertionResponse,*/
    fixedHeight: 60,
    gap: 10,
    rewind: true,
    pagination: false,
    isNavigation: true,
};

onMounted(() => {
    const main = mainCarousel.value?.splide;
    const thumbnails = thumbnailCarousel.value?.splide;

    if (main && thumbnails) {
        main.sync(thumbnails);
    }
});
</script>

<style scoped>

/* Main gallery image centering */
.main-gallery-img {
    width: auto;
    max-height: 70vh;
    display: block; /* Ensure the image is treated as a block-level element */
    margin: 0 auto; /* Center the image horizontally */
}

/* Thumbnail image styling */
.thumbnail-img {
    width: auto;
    max-height: 60px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 auto; /* Center the thumbnail images */
}

.splide-li-slide{
    width: 60vw;
    /*width: fit-content;*/
    display: flex;
    justify-content: center; 
    align-items: center; 

}

/* Center the unordered list of thumbnails */
#thumbnail-carousel .splide__list {
    display: flex;
    justify-content: center; 
    align-items: center; 
}

/* Optional: Add spacing between thumbnail items */
#thumbnail-carousel .splide__slide {
    margin: 0 5px; /* Adjust gap between thumbnails */
}

li {
    /*align-items: center ;*/
   /* align-self: center  ;*/
   /* justify-content: center  ;*/
   /* justify-self: center;*/
    width: fit-content !important;
}

/*
.main-gallery-img {
    width: auto;
    max-height: 80vh;
}

.thumbnail-img {
    width: 100%;
    max-height: 60px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
}
*/

</style>
