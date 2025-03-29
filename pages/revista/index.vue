<template>
    <div>
        <div v-if="loaded">
            <section>
                <HeroBanner title="Revista Latin Panty" backgroundImage="/assets/images/hero-banner.jpg"
                    :parallax="true" height="90vh" min-height="400px" overlay-opacity="0.7" subtitle="Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin
                            Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus
                            historias y sus secretos mejor guardados. ¡Suscríbete ahora y accede a contenido exclusivo,
                            entrevistas íntimas, fotos y videos que no encontrarás en ningún otro lugar"
                    cta-text="Regístrate Gratis">
                </HeroBanner>

            </section>


            <div class="container-fluid mt-5 px-md-5 px-1 ">
                <FeaturedArticlesSplide title="Artículos Sugeridos" :featuredArticles="featuredArticles" />
            </div>


            <div class="margins container-fluid">
                <CategoriesSplide :categories="categories" />
            </div>

            <div class="container-fluid px-md-5 px-1">
                <div v-for="category in categories" :key="category.category">
                    <FeaturedArticlesSplide :title="category.category"
                        v-if="categoryArticles(category.category, allArticles)"
                        :featuredArticles="categoryArticles(category.category, allArticles)" />
                </div>

            </div>


            <div v-if="allArticles.length > 0" class="container-fluid px-3 px-md-5 px-sm-1 mt-4 mt-md-5">
                <h2 class="text-start">Etiquetas</h2>
                <!-- Include the Tags component -->
                <div class="margins">
                    <Tags :tags="tags" />
                </div>

                <h2 class="text-start">Todos Los Artículos</h2>

                <div class="row gy-4 mx-0">
                    <div v-for="article in paginatedArticles" :key="article.title" class="col-12 col-sm-6 col-lg-3">
                        <ArticleCard :date="article.date" :title="article.title" :category="article.category"
                            :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]" :toc="article.body.toc.links" :cardHeight="'50vh'" />
                    </div>
                </div>

                <nav aria-label="Page navigation" class="mt-4 mt-md-5 mb-4 mb-md-5">
                    <ul class="pagination justify-content-center justify-content-md-start flex-wrap">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(1)">Primero</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
                        </li>
                        <li v-for="page in visiblePages" :key="page" class="page-item"
                            :class="{ active: page === currentPage }">
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(currentPage + 1)">Siguiente</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(totalPages)">Último</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-else class="text-center mt-4 mt-md-5">
                <p class="text-muted">No articles found</p>
            </div>


        </div>

        <div v-else>
            <div class="text-center loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const allArticles = ref([]);
const featuredArticles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;
const categories = ref([]);
const loaded = ref(false);
const tags = ref({});
const selectedTag = ref('todos');
const baseUrl = 'https://latinpanty.com'
const userStore = useUserStore();

function categoryArticles(category, arr) {
    const catArticles = arr.filter(elem => elem.category === category.toLowerCase())
    if (catArticles && catArticles.length > 0) {
        return catArticles
    }
    return false
}

useHead({
    link: [
        {
            rel: 'stylesheet',
            href: 'https://unpkg.com/bs-brain@2.0.4/components/blogs/blog-3/assets/css/blog-3.css',
        },
        {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        },
    ],
});

// Fetch categories
const fetchCategories = async () => {
    const { data } = await useFetch('/assets/magazine/category-banners.json');
    categories.value = data.value;
};

// Fetch all articles
const fetchAllArticles = async () => {
    const query = queryCollection('blog')
        .where('published', '=', true)
        .order('date', 'DESC');

    const { data } = await useAsyncData('blog', () => query.all());
    allArticles.value = data.value;

    // Extract and count tags
    const tagCounts = {};
    allArticles.value.forEach((article) => {
        if (article.tags) {
            article.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }


    });
    tags.value = tagCounts;
};

// Fetch featured articles
const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(12)
            .all()
    );
    featuredArticles.value = data.value;
};

// Handle tag selection
/*
const handleTagSelect = (tag) => {
    selectedTag.value = tag;
    currentPage.value = 1;
};
*/
// Filter articles based on the selected tag

const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value;
    }
    return allArticles.value.filter((article) => article.tags && article.tags.includes(selectedTag.value));
})


// Paginate filtered articles
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredArticles.value.slice(start, end);
});

// Total number of pages for filtered articles
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage));

// Visible pages for pagination
const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5;
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    return pages;
});

// Change page
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 3500);
    }
};

onMounted(async () => {
    const userr = await userStore.getUser()
    console.log('userr', userr)
    await fetchAllArticles();
    await fetchFeaturedArticles();
    await fetchCategories();
    loaded.value = true;
});

useSeoMeta({
    // Basic Meta Tags
    title: 'Latin Panty Revista | Descubre a las Estrellas Latinas',
    description: 'Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus historias y sus secretos mejor guardados. ¡Suscríbete ahora!',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: 'Latinas, OnlyFans, Instagram, Modelos, Revista, Entrevistas, Fotos, Videos',
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: 'Latin Panty Revista | Descubre a las Estrellas Latinas',
    ogDescription: 'Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus historias y sus secretos mejor guardados. ¡Suscríbete ahora!',
    ogImage: '/assets/images/hero-banner.jpg', // Replace with your homepage banner image
    ogUrl: `${baseUrl}/revista`, // Replace with your website URL
    ogType: 'website',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty Revista',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: 'Latin Panty Revista | Descubre a las Estrellas Latinas',
    twitterDescription: 'Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus historias y sus secretos mejor guardados. ¡Suscríbete ahora!',
    twitterImage: '/assets/images/hero-banner.jpg', // Replace with your homepage banner image
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}/revista`, // Canonical URL for SEO
    rating: 'adult',

});

</script>

<style scoped>
.margins {
    margin-top: 40px;
    margin-bottom: 40px;
}

.loading-spinner {
    height: 400px;
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pagination {
    flex-wrap: wrap;
    gap: 5px;
}

.page-link {
    padding: 0.375rem 0.75rem;
}

@media (min-width: 768px) {

    .pagination {
        gap: 0;
    }

    .page-link {
        padding: 0.5rem 0.75rem;
    }
}
</style>