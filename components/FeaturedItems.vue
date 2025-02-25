<template>
    <div class="wrapper my-5">
        <h2 id="autoplay-example-heading">Productos Sugeridos</h2>

        <Splide aria-labelledby="autoplay-example-heading" :options="options" :has-track="false">
            <div style="position: relative">
                <SplideTrack>
                    <SplideSlide v-for="slide in slides" :key="slide.image">
                       <!-- <div class="row border d-flex justify-content-center">-->
                            <div class="card text-center shadow-sm">

                                <!--<img class="image_prod" :src="slide.image" :alt="slide.name">-->

                                <NuxtLink :to="'/login'" style="overflow: hidden">
                                    <NuxtImg class="image_prod" provider="bunny" :src="slide.image" :alt="slide.name"
                                        :quality="50" placeholder="/assets/images/panty-icon.jpg" :height="'60vh'" />
                                </NuxtLink>
                                <div class="card-body">
                                    <h5 class="card-title">{{ slide.name }}</h5>
                                    <button class="btn btn-outline-success btn-sm">Explore</button>
                                </div>
                            </div>

                      <!-- </div>-->

                    </SplideSlide>
                </SplideTrack>
            </div>

            <div class="splide__progress">
                <div class="splide__progress__bar">
                </div>
            </div>

            <!--
            <button class="splide__toggle">
                <span class="splide__toggle__play">Play</span>
                <span class="splide__toggle__pause">Pause</span>
            </button>
            -->

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
        /*
        const slides = [
            { name: "Tops", image: "https://lingerie.b-cdn.net/landing/1.jpg" },
            { name: "Bottoms", image: "https://lingerie.b-cdn.net/landing/2.jpg" },
            { name: "Outerwear", image: "https://lingerie.b-cdn.net/landing/3.jpg" },
            { name: "Accessories", image: "https://lingerie.b-cdn.net/landing/4.jpg" },
        ];*/

        const slides = [
            { name: "Tops", image: "/landing/1.jpg" },
            { name: "Bottoms", image: "/landing/2.jpg" },
            { name: "Outerwear", image: "/landing/3.jpg" },
            { name: "Accessories", image: "/landing/4.jpg" },
            { name: "Tops", image: "/landing/1.jpg" },
            { name: "Bottoms", image: "/landing/2.jpg" },
            { name: "Outerwear", image: "/landing/3.jpg" },
            { name: "Accessories", image: "/landing/4.jpg" }
        ];

        const options: Options = {
            rewind: true,
            perPage: 4,
            gap: '1rem',
            autoplay: true,
            /* height: '80vh',*/
        };

        return {
            slides,
            options,
        }
    },
});
</script>

<style scoped>
.wrapper {
    margin-bottom: 100px !important;
}

.image_prod {
    /*max-height: 600px;*/
    height: 400px;
   /* width: 300px !important;*/
}

.splide__track{
    
}
</style>