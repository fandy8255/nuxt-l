<template>
    <div class="wrapper px-5">
        <h2 id="autoplay-example-heading">Artículos Sugeridos</h2>

        <Splide aria-labelledby="autoplay-example-heading" :options="options" :has-track="false">
            <div style="position: relative">
                <SplideTrack>
                    <SplideSlide v-for="article in featuredArticles" :key="article.title">
                        <ArticleCard
                            :date="article.date"
                            :title="article.title"
                            :category="article.category"
                            :imgSrc="article.image"
                            :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]"
                            :toc="article.body.toc.links"
                            :cardHeight="'50vh'"
                        />
                    </SplideSlide>
                </SplideTrack>
            </div>

            <div class="splide__progress">
                <div class="splide__progress__bar"></div>
            </div>
        </Splide>
    </div>
</template>

<script lang="ts">
import { Splide, SplideSlide, SplideTrack, Options } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { defineComponent, PropType } from 'vue';
import ArticleCard from '~/components/ArticleCard.vue'; // Adjust the import path as needed

export default defineComponent({
    name: 'FeaturedItems',

    components: {
        Splide,
        SplideTrack,
        SplideSlide,
        ArticleCard,
    },

    props: {
        featuredArticles: {
            type: Array as PropType<Array<{
                title: string;
                date: string;
                category: string;
                image: string;
                description: string;
                stem: string;
                body: {
                    toc: {
                        links: any[];
                    };
                };
            }>>,
            required: true,
        },
    },

    setup() {
        const options: Options = {
            rewind: true,
            perPage: 3,
            gap: '1rem',
            autoplay: true,
        };

        return {
            options,
        };
    },
});
</script>

<style scoped>
.wrapper {
    margin-bottom: 100px !important;
}

.splide__track {
    /* Add any custom styles for the track here */
}
</style>