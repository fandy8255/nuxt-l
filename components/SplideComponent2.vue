<template>
    <section>
        <!-- Main Gallery -->
        <Splide id="main-carousel" :options="mainOptions" ref="mainCarousel" aria-label="Main Gallery">
            <SplideSlide v-for="(image, index) in images" :key="index">
                <img :src="image" :alt="'Image ' + index" />
            </SplideSlide>
        </Splide>

        <!-- Thumbnail Gallery -->
        <Splide id="thumbnail-carousel" :options="thumbnailOptions" ref="thumbnailCarousel"
            aria-label="Thumbnail Gallery">
            <SplideSlide v-for="(image, index) in images" :key="'thumb-' + index">
                <img :src="image" :alt="'Thumbnail ' + index" />
            </SplideSlide>
        </Splide>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

export default defineComponent({
    name: 'SynchronizedGallery',

    components: {
        Splide,
        SplideSlide,
    },

    setup() {
        const images = [
            '	https://lingerie.b-cdn.net/fandy8255/products/fandy8255_bd57e953-484a-452e-995a-ea55019f931f.jpg',
            '	https://lingerie.b-cdn.net/fandy8255/products/fandy8255_bd57e953-484a-452e-995a-ea55019f931f.jpg',
            'https://lingerie.b-cdn.net/NINA-KRAVIZ-TO-BE0694-copy-1-683x1024.jpg',
            '	https://lingerie.b-cdn.net/fandy8255/products/fandy8255_bd57e953-484a-452e-995a-ea55019f931f.jpg',
        ];

        const mainOptions = {
            type: 'fade',
            rewind: true,
            pagination: false,
            arrows: false,
        };

        const thumbnailOptions = {
            fixedWidth: 100,
            fixedHeight: 60,
            gap: 10,
            rewind: true,
            pagination: false,
            isNavigation: true,
            breakpoints: {
                600: {
                    fixedWidth: 60,
                    fixedHeight: 44,
                },
            },
        };

        const mainCarousel = ref(null);
        const thumbnailCarousel = ref(null);

        onMounted(() => {
            // Sync the two carousels
            const main = mainCarousel.value.splide;
            const thumbnails = thumbnailCarousel.value.splide;
            main.sync(thumbnails);
        });

        return {
            images,
            mainOptions,
            thumbnailOptions,
            mainCarousel,
            thumbnailCarousel,
        };
    },
});
</script>

<style>
.splide__slide img {
    width: 100%;
    max-height: 60vh !important;
    object-fit: cover;
}
</style>