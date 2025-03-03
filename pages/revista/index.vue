<template>
    <div>
        <!-- Hero Section with Parallax -->
        <div class="hero-section text-center d-flex justify-content-center align-items-center mb-5">
            <div class="parallax-bg"></div>
            <div class="hero-content">
                <h1 class="display-2 fw-bold text-white mb-4">Revista Latin Panty</h1>
                <p class="lead text-light mb-4">Revisa Nuestros Posts</p>
                <div class="stats d-flex justify-content-center gap-4">
                    <div class="stat-item">
                        <i class="fas fa-users fa-2x text-white"></i>
                        <h3 class="text-white mt-2">Colombianas Onlyfans</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Featured Articles 
        <div class="container-fluid p-3 px-5">
            <FeaturedArticles :featuredArticles="featuredArticles" />
        </div>-->

        <div class="container-fluid px-5">
            <FeaturedArticlesSplide :featuredArticles="featuredArticles" />
        </div>

        

        <!-- Categories Section -->
        <div class="margins container-fluid px-5">
            <Categories :categories="categories" @select-category="handleCategorySelect" />
        </div>

        <!-- All Articles -->
        <div v-if="articles" class="margins container-fluid p-5 px-5">
            <h2 class="text-start">Publicaciones</h2>
            <div class="row gy-4 mx-0">
                <div v-for="article in articles" :key="article.title" class="col-sm-12 col-md-6 col-lg-3">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FeaturedArticles from '~/components/FeaturedArticles.vue';
import Categories from '~/components/Categories.vue';

const articles = ref([]);
const featuredArticles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const totalArticles = ref(0);
const selectedCategory = ref('');

const categories = [
    { category: 'Instagram', img: '/assets/images/hero-banner.jpg' },
    { category: 'Onlyfans', img: '/assets/images/hero-banner.jpg' },
    { category: 'shoes', img: '/assets/images/hero-banner.jpg' },
    { category: 'shorts', img: '/assets/images/hero-banner.jpg' },
    { category: 'more', img: '/assets/images/hero-banner.jpg' },
    { category: 'other', img: '/assets/images/hero-banner.jpg' },
];

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

const fetchArticles = async (page) => {
    const skip = (page - 1) * itemsPerPage;
    const query = queryCollection('blog')
        .where('published', '=', true)
        .order('date', 'DESC')
        .skip(skip)
        .limit(itemsPerPage);

    if (selectedCategory.value) {
        query.where('category', '=', selectedCategory.value);
    }

    const { data } = await useAsyncData('blog', () => query.all());
    articles.value = data.value;

    const { data: totalData } = await useAsyncData('total', () =>
        queryCollection('blog')
            .where('published', '=', true)
            .where('category', '=', selectedCategory.value)
            .count()
    );
    totalArticles.value = totalData.value;
};

const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(6)
            .all()
    );
    featuredArticles.value = data.value;
};

const handleCategorySelect = (category) => {
    selectedCategory.value = category;
    fetchArticles(currentPage.value);
};

onMounted(async () => {
    await fetchArticles(currentPage.value);
    await fetchFeaturedArticles();
    window.scrollTo(0, 0);
});

const totalPages = computed(() => Math.ceil(totalArticles.value / itemsPerPage));

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

const changePage = async (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        await fetchArticles(page);
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>

/*
h2{
    font-weight: 2rem;
    font-style: italic !important;
    font-size: 70px !important;
}*/

.margins{
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