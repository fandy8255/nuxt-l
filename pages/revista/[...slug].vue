<template>
    <div id="main-article-container">
        <ContentRenderer v-if="data" :value="data">
            <div class="container">

                <div class="row d-xl-flex d-sm-block">
                    <div class="col-xl-4 col-sm-12">
                        <div class="container w-100 justify-content-center d-flex" id="link-container">
                            <!--
                            <ul id="toc-ul" class="border border-1">
                                <li class="toc-li" :key="link.id" v-for="link in data.body.toc.links">
                                    <a class="toc-link text-decoration-none" :href="`#${link.id}`"> {{ link.id }} </a>
                                </li>
                            </ul>
                            -->

                            <!--{{ data.body.toc.links }} -->
                        </div>

                    </div>
                    <ContentRendererMarkdown style="color:brown" :value="data"
                        class="col-xl-8 col-sm-12 text-start text-decoration-none" />
                </div>

            </div>

        </ContentRenderer>

        <div v-else class="mt-5">
            <p>Content Not Found</p>
            <p>Content Not Found</p>
            <p>Content Not Found</p>
            <p>Content Not Found</p>
        </div>
    </div>
</template>

<script setup>

console.log(useRoute().params.slug[0])
const slug = (useRoute().params.slug[0]).toString()

//const { data } = await useAsyncData('page-data', () => queryContent('articles/' + slug).findOne())
//const { data } = await useAsyncData('page-data', () => queryContent('/articles/' + slug).findOne())

//const { data } = await useAsyncData(() => queryCollection('content').path('/').first())
const { data } = await useAsyncData(() => queryCollection('content').path('/articles/article').first())

console.log('data', data)

/*
useSeoMeta({
    title: 'Latin Panty Revista | ' + data.value.title,
    ogTitle: 'Latin Panty Revista |'+ data.value.title,
    description: data.value.description,
    ogDescription: data.value.description,
    ogImage: data.value.image,
    twitterCard: 'summary_large_image',
})
*/

</script>

<style scoped>
#link-container {
    position: sticky !important;
    top: 70px !important;
}

a {
    color: green;
    text-decoration: none;

}

#toc-ul{
    width: fit-content;
    padding: 10px 50px 10px 50px;
    border-radius: 10px;
    /*list-style: none;*/
}

.toc-li{
    width:fit-content;
}

a:hover{
    color: greenyellow !important;
}

#main-article-container {
    margin-top: 100px !important;
}
</style>