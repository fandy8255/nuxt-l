<template>
    <div>
        <div class="flex justify-center mt-5">

            <div class="container">
                <div class="row justify-content-md-center">
                    <div class="col-12">
                        <h3 class="fs-6 text-secondary mb-2 text-uppercase text-center">Our News</h3>
                        <h2 class="display-5 mb-4 mb-md-5 text-center">Here is our blog's latest company news about
                            regularly publishing fresh content.</h2>
                        <!--<hr class="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle">-->
                        <section class="hero-section text-center py-xl-5 py-sm-1" style="">
                            <div class="container">
                                <h1 class="display-4 fw-bold mb-4 py-2" style="color: aliceblue !important;">Revista Latin Panty</h1>
                                <div class="text-container">
                                    <p class="lead mb-4 text-light banner-text">
                                        Revisa Nuestros Posts
                                    </p>
                                    <div class="stats d-md-flex justify-content-center gap-xl-4 gap-1 mb-5 d-none ">
                                        <div class="stat-item">
                                            <i class="bi bi-people-fill"></i>
                                            <h3 class="banner-headings text-light">Colombianas Onlyfans</h3>
                                            
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-person-plus-fill"></i>
                                            <h3 class="banner-headings text-light">1,854,140</h3>
                                            
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-camera-reels-fill"></i>
                                            <h3 class="banner-headings text-light">855,612</h3>
                                            
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-cash-coin"></i>
                                            <h3 class="banner-headings text-light">883,569</h3>
                                        </div>
                                    </div>
                                    <button @click="ctaClick" class="btn btn-action btn-lg mb-xl-0 mb-3 ">Suscríbete a nuestra revista</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <div v-if="articles" class="container overflow-hidden">
                <div class="row gy-4 gy-lg-0">
                    <div v-for="article in articles" :key="article.title" class="col-sm-12 col-lg-4">
                        {{ article.stem }}
                        <ArticleCard :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]" :toc="article.toc" />
                        <!--
                        <ArticleCard :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="'/' + article._stem.split('/')[1]" :toc="article.body.toc.links" />-->
                        
                    
                       
                    </div>
                </div>
            </div>
            <div v-else>
                no articles found
            </div>



        </div>

    </div>

</template>

<script setup>

import { onMounted } from 'vue'

useHead({
    link: {
        rel: "stylesheet",
        href: "https://unpkg.com/bs-brain@2.0.4/components/blogs/blog-3/assets/css/blog-3.css"
    }
})

const articles = useState('articles')

onMounted(async () => {
    //articles.value = await queryContent('articles').limit(2).find()
    const { data } = await useAsyncData('blog', () => queryCollection('blog').all())
    console.log('blog data', data)
    articles.value=data
    window.scrollTo(0, 0)

})


</script>

<style>

.hero-section {
    background: linear-gradient(to bottom right, #ff7eb9, #ff758c);
    color: white;
    height: 90vh;
    background-image: url('/assets/images/hero-banner.jpg');
    background-size: cover;
    background-position: center;
    /*padding: 100px 0;*/
}

a {
    color: azure
}

@media only screen and (max-width: 600px) {

    #main-container {
        padding: 1vw;
    }

}
</style>