<template>
    <div>
        <!-- Hero Section -->
        <div v-if="loaded">
            <div class="hero-section">
                <div class="banner-img">
                    <NuxtImg :src="bannerData.image" :alt="bannerData.alt" class="banner-image"
                        placeholder="/assets/images/placeholder.jpg" />
                </div>
                <div class="hero-content p-5">
                    <h1 class="display-2 fw-bold text-white mb-4">{{ categoryName.toUpperCase() }}</h1>
                    <p class="lead text-light mb-4">{{ bannerData.caption }}</p>
                    <div class="stats d-flex justify-content-center gap-4">
                        <div class="stat-item">
                            <i class="fas fa-users fa-2x text-white"></i>
                            <h3 class="text-white mt-2">Colombianas Onlyfans</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-fluid">
                <FeaturedArticlesSplide :featuredArticles="featuredArticles" />
            </div>

            <!-- Tags Section -->


            <!-- All Articles -->
            <div v-if="allArticles.length > 0" class="container-fluid px-5 mt-5">
                <h2 class="text-start">Publicaciones</h2>
                <div class="margins container-fluid">
                    <Tags :tags="tags" @select-tag="handleTagSelect" />
                </div>
                <div class="row gy-4 mx-0">
                    <div v-for="article in paginatedArticles" :key="article.title" class="col-sm-12 col-md-6 col-lg-3">
                        <ArticleCard :date="article.date" :title="article.title" :category="article.category"
                            :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]" :toc="article.body.toc.links" :cardHeight="'50vh'" />
                    </div>
                </div>

                <!-- Pagination Controls -->
                <nav aria-label="Page navigation" class="mt-5 mb-5">
                    <ul class="pagination justify-content-center flex-wrap">
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
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryName = ref(route.params.categoryName[0]);
const allArticles = ref([]); // Store all fetched articles
const tags = ref({});
const currentPage = ref(1);
const itemsPerPage = 4; // Number of articles per page
const banners = ref([]);
const loaded = ref(false);
const featuredArticles = ref([]);
const selectedTag = ref('todos'); // Default to 'todos' to show all articles
const baseUrl = 'https://latinpanty.com'

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

// Fetch banner data from the JSON file
const fetchBanners = async () => {
    const { data } = await useFetch('/assets/magazine/category-banners.json');
    banners.value = data.value;
};

// Find the banner data for the current category
const bannerData = computed(() => {
    const banner = banners.value.find((banner) => {
        const bannerCategory = banner.category.toLowerCase().trim();
        const currentCategory = categoryName.value.toLowerCase().trim();
        return bannerCategory === currentCategory;
    });

    return banner || {
        image: '/assets/images/panty-icon.jpg',
        alt: 'Default Banner',
        caption: 'Categoría: ' + categoryName.value,
    };
});

// Fetch all articles for the category
const fetchAllArticles = async () => {
    const query = queryCollection('blog')
        .where('published', '=', true)
        .where('category', '=', categoryName.value)
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
            .where('category', '=', categoryName.value)
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(6)
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
        //window.scrollTo(0, 0);
    }
};

onMounted(async () => {
    await fetchBanners(); // Fetch banner data
    await fetchAllArticles(); // Fetch all articles for the category
    await fetchFeaturedArticles();
    loaded.value = true;
    window.scrollTo(0, 0);
});

useSeoMeta({
    // Basic Meta Tags
    title: `Latin Panty Revista | Latinas ${categoryName.value.toUpperCase()}`,
    description: bannerData.value.caption || `Explora las mejores publicaciones sobre ${categoryName.value} en Latin Panty Revista.`,
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: `${categoryName.value}, Latinas, OnlyFans, Instagram, Modelos, ${Object.keys(tags.value).join(', ')}`,
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: `Latin Panty Revista | ${categoryName.value.toUpperCase()}`,
    ogDescription: bannerData.value.caption || `Explora las mejores publicaciones sobre ${categoryName.value} en Latin Panty Revista.`,
    ogImage: bannerData.value.image || '/assets/images/panty-icon.jpg',
    ogUrl: `${baseUrl}/revista/${categoryName.value}`,
    ogType: 'website',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty Revista',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: `Latin Panty Revista | ${categoryName.value.toUpperCase()}`,
    twitterDescription: bannerData.value.caption || `Explora las mejores publicaciones sobre ${categoryName.value} en Latin Panty Revista.`,
    twitterImage: bannerData.value.image || '/assets/images/panty-icon.jpg',
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}/revista/${categoryName.value}`,
    rating: 'adult',

    // Structured Data (JSON-LD)
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: `Latin Panty Revista | ${categoryName.value.toUpperCase()}`,
                description: bannerData.value.caption || `Explora las mejores publicaciones sobre ${categoryName.value} en Latin Panty Revista.`,
                image: bannerData.value.image || '/assets/images/panty-icon.jpg',
                url: `${baseUrl}/revista/${categoryName.value}`,
                about: {
                    '@type': 'Category',
                    name: categoryName.value.toUpperCase(),
                    description: `Categoría dedicada a ${categoryName.value} en Latin Panty Revista.`,
                },
            }),
        },
    ],
});


</script>

<style scoped>
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

.banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-content {
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    /* Semi-transparent overlay */
    /*padding: 20px;*/
    border-radius: 10px;
}

.stats {
    margin-top: 20px;
}

.stat-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 15px;
    transition: transform 0.3s ease, background 0.3s ease;
}

.stat-item:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}
</style>