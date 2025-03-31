<template>
    <div id="main-article-container">
        <div class="container-xl">
            <PopupOptIn />
            <!-- Hero Section 
            <section>
                <BackButton />
            </section>-->

            <SimpleHeroArticle class="mt-1" :imgUrl="data.image" :title="data.title" :subtitle="data.meta.subtitle" />

            <!-- Main Content Layout -->
            <div class="row">
                <!-- Table of Contents (Left Column for md-xl, Top for sm) -->
                <div class="col-md-3 col-12 order-md-1 order-2 mt-5" id="toc-column">

                    <div class="toc-container">
                        <ul id="toc-ul" class="border border-1">
                            <!-- {{ data.body.toc.links }}-->
                            <li class="toc-li" :key="link.id" v-for="link in data.body.toc.links">
                                <a class="toc-link text-decoration-none" :href="`#${link.id}`"> {{ link.text }} </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Blog Content (Right Column for md-xl, Below TOC for sm) -->
                <div class="col-md-9 col-12 order-md-2 order-1">
                    <!-- Frontmatter Details -->
                    <div class="frontmatter-details mt-5 p-md-3 p-0">
                        <div class="row">
                            <div class="col-md-6">
                                <h2 class="headings fw-bold">Descripcion</h2>
                                <p>{{ data.description }}</p>
                            </div>
                            <div class="col-md-6">
                                <h2 class="headings fw-bold">Detalles</h2>
                                <ul class="list-unstyled">
                                    <li><strong>Fecha:</strong> {{ formatDate(data.date) }}</li>
                                    <li><strong>Categoría:</strong> {{ data.category }}</li>
                                    <li>
                                        <strong>Etiquetas:</strong>
                                        <ArticleTags :tags="data.tags" />
                                    </li>
                                    <!--
                                    <li><strong>Etiquetas:</strong>
                                        <span v-for="(tag, index) in data.tags" :key="index"
                                            class="taggy badge text-light fw-normal m-1">
                                            {{ tag }}
                                        </span>
                                    </li>-->
                                </ul>
                                <!-- Add Social Media Links Component -->

                                <!-- {{ data }}-->
                                <SocialMediaLinks v-if="socialLinks" :socialLinks="socialLinks" />
                            </div>
                        </div>
                    </div>

                    <!-- Blog Content -->
                    <ContentRenderer v-if="data" :value="data" class="mb-5" :components="Gallery" />
                </div>
                <div class="container-fluid mb-1">
                    <FeaturedArticlesSplide :featuredArticles="suggestedArticles" title="Artículos Similares" />
                </div>


            </div>
        </div>
    </div>
</template>

<script setup>
const slug = useRoute().params.slug[0].toString();
//const { data } = await useAsyncData(() => queryCollection('content').path('/articles/' + slug).first());
const { data } = await useAsyncData(() => queryCollection('blog').path('/articles/' + slug).first());
let suggestedArticles = ref([]);

// Format date function
const formatDate = (dateString) => {
    // Split the date string into year, month, and day
    const [year, month, day] = dateString.split('-');

    // Create a Date object in local time
    const date = new Date(year, month - 1, day); // Note: Months are 0-indexed in JavaScript

    // Format the date
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
// SEO Meta

const articleName = data.value?.path.split('/').pop();
const category = data.value?.category.charAt(0).toUpperCase() + data.value?.category.slice(1)


const query = queryCollection('blog')
    .where('published', '=', true)
    .where('category', '=', data.value.category)
    .order('date', 'DESC');

let arr = await useAsyncData('blog', () => query.all());

console.log(typeof arr)
console.log(data.value.title)
/*
arr=arr.filter(elem=>elem.id !== data.id)
*/

suggestedArticles.value = arr.data.value.filter(elem => elem.title !== data.value.title)

console.log('arr', suggestedArticles)

/*
console.log('hhh', suggestedArticles.filter(elem=>elem.id !== data.id))
*/

//console.log('suggested', suggestedArticles)

const socialLinks = computed(() => {
    return {
        ig: data.value.meta?.ig,
        fb: data.value.meta?.fb,
        onlyfans: data.value.body.meta?.onlyfans,
        chaturbate: data.value.meta?.chaturbate,
        x: data.value.meta?.x,
        phub: data.value.meta?.phub,
    };
});

const baseUrl = 'https://latinpanty.com'

useSeoMeta({
    // Basic Meta Tags
    title: `Latin Panty Revista | Latinas ${category} | ${data.value?.title}`,
    description: data.value?.description,
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: data.value?.tags.join(', '),
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: `Latin Panty Revista | Latinas ${category} | ${data.value?.title}`,
    ogDescription: data.value?.description,
    ogImage: data.value?.image,
    ogUrl: `${baseUrl}/revista/${articleName}`,
    ogType: 'article',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty Revista',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: `Latin Panty Revista | ${data.value?.title}`,
    twitterDescription: data.value?.description,
    twitterImage: data.value?.image,
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}/revista/articulos/${articleName}`,
    rating: data.adult? 'adult':'mature',

    // Structured Data (JSON-LD)
    /*
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: data.value?.title,
                description: data.value?.description,
                image: data.value?.image,
                datePublished: data.value?.date,
                author: {
                    '@type': 'Organization',
                    name: 'Latin Panty Revista',
                    url: `${baseUrl}`,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Latin Panty Revista',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${baseUrl}/assets/images/panty-icon.png`,
                    },
                },
                about: {
                    '@type': 'Person',
                    name: data.value?.title,
                    description: `A talented adult performer featured in Latin Panty Revista.`,
                    sameAs: [
                        data.value?.social?.ig,
                        data.value?.social?.fb,
                        data.value?.social?.onlyfans,
                        data.value?.social?.chaturbate,
                        data.value?.social?.x,
                        data.value?.social?.phub,
                    ].filter(Boolean), // Only include valid URLs
                },
            }),
        },
    ],*/
});

</script>


<style scoped>
.taggy {
    background: rgba(219, 74, 132) !important;
}

.headings {
    font-size: 1.5rem;
}


#main-article-container {
    margin-top: 20px;
}

#toc-column {
    position: relative;
}

.toc-container {
    position: sticky;
    top: 100px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;

}

#toc-ul {
    list-style: none;
    padding: 10px;
    border-radius: 8px;
    background: #f8f9fa;
}

.toc-li {
    margin: 8px 0;
}

.toc-link {
    color: green;
    text-decoration: none;
}

.toc-link:hover {
    color: rgba(219, 74, 132) !important;
}

/* Frontmatter Details Styling */
.frontmatter-details {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
}

.badge {
    font-size: 0.9em;
    padding: 0.5em 0.75em;
}

/* Responsive Layout */
@media (max-width: 767.98px) {
    .toc-container {
        position: static;
        max-height: 30vh;
        overflow-y: auto;
        margin-bottom: 20px;
    }

    #toc-ul {
        padding: 10px 20px;
    }
}
</style>