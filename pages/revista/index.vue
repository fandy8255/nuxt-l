<template>
    <div>
        <div v-if="loaded">
            <section>
                <HeroBanner title="Revista Latin Panty" backgroundImage="/assets/images/hero-banner.jpg"
                    :parallax="true" height="75vh" min-height="400px" overlay-opacity="0.7" subtitle="Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin Panty, te llevamos detrás de cámaras para conocer a tus modelos Descubre el mundo de las estrellas latinas más candentes y exclusivas. En Latin
                            Panty, te llevamos detrás de cámaras para conocer a tus modelos favoritas, sus
                            historias y sus secretos mejor guardados. ¡Suscríbete ahora y accede a contenido exclusivo,
                            entrevistas íntimas, fotos y videos que no encontrarás en ningún otro lugar"
                    cta-text="Regístrate Gratis">
                </HeroBanner>

            </section>


            <div class="container-fluid mt-5">
                <FeaturedArticlesSplide :featuredArticles="featuredArticles" />
            </div>

            <div v-if="allArticles.length > 0" class="container-fluid px-3 px-md-5 px-sm-1 mt-4 mt-md-5">
                <h2 class="text-start">Publicaciones</h2>
                <!-- Include the Tags component -->
                <Tags :tags="tags" @select-tag="handleTagSelect" />
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

            <div class="margins container-fluid">
                <CategoriesSplide :categories="categories" />
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
const selectedCategory = ref('');
const categories = ref([]);
const loaded = ref(false);
const tags = ref({});
const selectedTag = ref('todos');
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
    currentPage.value = 1;
};

// Filter articles based on the selected tag
const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value;
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