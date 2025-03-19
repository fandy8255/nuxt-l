<template>
    <div>
        <div v-if="loaded">
            <div class="hero-section text-center d-flex justify-content-center align-items-center mb-5">
                <div class="parallax-bg"></div>
                <div class="hero-content">
                    <h1 class="display-3 fw-bold text-white mb-4">Revista Latin Panty</h1>
                    <div class="text-container p-5 mt-3">
                        <p class="text-light mb-4" style="font-size: 1.25rem; max-width: 900px; margin: 0 auto;">
                            Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin
                            Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus
                            historias y sus secretos mejor guardados. ¡Suscríbete ahora y accede a contenido exclusivo,
                            entrevistas íntimas, fotos y videos que no encontrarás en ningún otro lugar!
                        </p>
                        <!--
                        <div class="stats d-flex justify-content-center gap-4 mt-4">
                            <div class="stat-item d-flex align-items-center gap-3">
                                <i class="fas fa-heart fa-2x text-white"></i>
                                <h3 class="text-white mt-2">Latinas</h3>
                            </div>
                        </div>-->
                        <!-- Call-to-Action Button -->
                        <a href="/suscribirse" class="cta btn btn-lg text-light fw-bolder mt-4"
                            style="font-size: 1.1rem; padding: 10px 30px; background:rgba(219, 74, 132) !important;">
                            Suscríbete Ahora
                        </a>
                    </div>
                </div>
            </div>



            <div class="container-fluid">
                <FeaturedArticlesSplide :featuredArticles="featuredArticles" />
            </div>



            <div v-if="allArticles.length > 0" class="container-fluid px-5 mt-5">
                <h2 class="text-start">Publicaciones</h2>
                <!-- Include the Tags component -->
                <Tags :tags="tags" @select-tag="handleTagSelect" />
                <div class="row gy-4 mx-0">
                    <div v-for="article in paginatedArticles" :key="article.title" class="col-sm-12 col-md-6 col-lg-3">
                        <ArticleCard :date="article.date" :title="article.title" :category="article.category"
                            :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]" :toc="article.body.toc.links" :cardHeight="'50vh'" />
                    </div>
                </div>

                <nav aria-label="Page navigation" class="mt-5 mb-5">
                    <ul class="pagination justify-content-start flex-wrap">
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
            <div v-else class="text-center mt-5">
                <p class="text-muted">No articles found</p>
            </div>

            <div class="margins container-fluid">
                <CategoriesSplide :categories="categories" />
            </div>

        </div>

        <div v-else>
            <div class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Tags from '~/components/Tags.vue'; // Import the Tags component

const allArticles = ref([]); // Store all fetched articles
const featuredArticles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8; // Number of articles per page
const selectedCategory = ref('');
const router = useRouter();
const categories = ref([]);
const loaded = ref(false);
const tags = ref({});
const selectedTag = ref('todos'); // Default to 'todos' to show all articles
const baseUrl = 'https://latinpanty.com'
const userStore = useUserStore();


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
const handleTagSelect = (tag) => {
    selectedTag.value = tag;
    currentPage.value = 1; // Reset to the first page when a new tag is selected
};

// Filter articles based on the selected tag
const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value; // Show all articles
    }
    return allArticles.value.filter((article) => article.tags && article.tags.includes(selectedTag.value));
});

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
        // window.scrollTo(0, 0);
    }
};

onMounted(async () => {
    const userr= await userStore.getUser()
    console.log('userr', userr)
    await fetchAllArticles(); // Fetch all articles once
    await fetchFeaturedArticles();
    await fetchCategories();
    loaded.value = true;
    //window.scrollTo(0, 0);
});

// SEO Meta Tags
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
.cta:hover {
    color: white !important;
}

.margins {
    margin-top: 60px;
    margin-bottom: 60px;
}

/* Hero Section with Parallax */
.hero-section {
    position: relative;
    height: 70vh;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.parallax-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/assets/images/hero-banner.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
    /*transform: translateZ(-1px) scale(2);*/
    /* Parallax effect */
}

.hero-content {
    z-index: 1;
}

.hero-section h1 {
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-section p {
    font-size: 1.75rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.stats {
    margin-top: 20px;
}

.text-container {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 15px;
    transition: transform 0.3s ease, background 0.3s ease;
}

.text-container:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}

/* All Articles */
#publicaciones {
    /*font-size: 3rem;*/
    font-weight: bold;
    color: #333;
    margin-bottom: 40px;
}

/* Pagination Styles */
.pagination {
    flex-wrap: wrap;
}
</style>
