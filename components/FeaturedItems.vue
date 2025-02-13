<template>
    <div class="wrapper">
        <h2 id="autoplay-example-heading">Autoplay</h2>

        <Splide aria-labelledby="autoplay-example-heading" :options="options" :has-track="false">
            <div style="position: relative">
                <SplideTrack>
                    <SplideSlide v-for="slide in slides" :key="slide.image">
                        <img :src="slide.image" :alt="slide.image">
                    </SplideSlide>
                </SplideTrack>
            </div>

            <div class="splide__progress">
                <div class="splide__progress__bar">
                </div>
            </div>

            <button class="splide__toggle">
                <span class="splide__toggle__play">Play</span>
                <span class="splide__toggle__pause">Pause</span>
            </button>
        </Splide>
    </div>
</template>

<script lang="ts">
import { Splide, SplideSlide, SplideTrack, Options } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FeaturedItems',

    components: {
        Splide,
        SplideTrack,
        SplideSlide,
    },

    setup() {
        //const slides = generateSlides();
        const slides = [
            { name: "Vintage Denim Jacket", image: "/images/featured/jacket.jpg", price: 40 },
            { name: "Floral Summer Dress", image: "/images/featured/dress.jpg", price: 25 },
            { name: "Leather Handbag", image: "/images/featured/handbag.jpg", price: 60 }]

        const options: Options = {
            rewind: true,
            perPage: 2,
            gap: '1rem',
            autoplay: true,
            height: '15rem',
        };

        return {
            slides,
            options,
        }
    },
});
</script>