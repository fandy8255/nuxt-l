<template>
    <div class="px-3">
        <section id="main-carousel" class="splide" v-if="useState('featuredProducts')">
            <div class="splide__track">
                <ul class="splide__list mx-5">
                    <li class="splide__slide" v-for="featuredItem in featuredItems"
                        :key="featuredItem.title">
                        <!--featuredProducts defined in tienda/index page -->
                        <div class="container">
                            
                        </div>
                    </li>
                </ul>
            </div>
        </section>


    </div>

</template>

<script setup>

import { onMounted, onUpdated } from 'vue';

import Splide from '@splidejs/splide';

onMounted(async () => {

    var main = new Splide('#main-carousel', {
        type: 'loop',
        perPage: 4,
        perMove: 1,
        breakpoints: {
            640: {
                perPage: 1,
            },
        }
    });

    main.mount();
    console.log('featured mounted')
})

</script>

<style>
.splide__slide img {
    width: 100%;
    max-height: 60vh !important;
    object-fit: cover;
}

@media only screen and (max-width: 600px) {

    .card {
        width: 90vw !important;
    }


}
</style>