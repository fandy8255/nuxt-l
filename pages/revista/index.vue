<template>
    <div>
        <div class="flex justify-center mt-5">
            <div class="container-xl">
                <div class="row justify-content-md-center">
                    <div class="col-12">
                        <h3 class="fs-6 text-secondary mb-2 text-uppercase text-center">Our News</h3>
                        <h2 class="display-5 mb-4 mb-md-5 text-center">Here is our blog's latest company news about
                            regularly publishing fresh content.</h2>
                        <section class="hero-section text-center py-xl-5 py-sm-1">
                            <div class="container">
                                <h1 class="display-4 fw-bold mb-4 py-2" style="color: aliceblue !important;">Revista
                                    Latin Panty</h1>
                                <div class="text-container">
                                    <p class="lead mb-4 text-light banner-text">Revisa Nuestros Posts</p>
                                    <div class="stats d-md-flex justify-content-center gap-xl-4 gap-1 mb-5 d-none">
                                        <div class="stat-item">
                                            <i class="bi bi-people-fill"></i>
                                            <h3 class="banner-headings text-light">Colombianas Onlyfans</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <div v-if="articles" class="container overflow-hidden mt-5">
                <div class="row gy-4 gy-lg-0">
                    <div v-for="article in articles" :key="article.title" class="col-sm-12 col-lg-4">
                        <ArticleCard :date="article.date" :title="article.title" :category="article.category"
                            :imgSrc="article.image" :articleDescription="article.description"
                            :artPath="article.stem.split('/')[1]" :toc="article.body.toc.links" />
                    </div>
                </div>

                <!-- Pagination Controls -->
                <nav aria-label="Page navigation" class="mt-4 bg-light">
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
            <div v-else>
                No articles found
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const articles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3; // Number of articles per page
const totalArticles = ref(0); // Total number of articles (for pagination)

// Fetch articles with backend pagination
const fetchArticles = async (page) => {
    const skip = (page - 1) * itemsPerPage;
    const { data } = await useAsyncData('blog', () =>
        queryCollection('blog')
            .where('published', '=', true)
            .order('date', 'DESC')
            .skip(skip)
            .limit(itemsPerPage)
            .all()
    );
    articles.value = data.value;

    // Fetch total number of articles for pagination
    const { data: totalData } = await useAsyncData('total', () =>
        queryCollection('blog').count()
    );
    totalArticles.value = totalData.value;
};

// Fetch articles on mount
onMounted(async () => {
    await fetchArticles(currentPage.value);
    window.scrollTo(0, 0);
});

// Pagination logic
const totalPages = computed(() => Math.ceil(totalArticles.value / itemsPerPage));

const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5; // Number of visible page buttons
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
        await fetchArticles(page); // Fetch articles for the new page
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
};
</script>

<style>
.hero-section {
    background: linear-gradient(to bottom right, #ff7eb9, #ff758c);
    color: white;
    width: 100%;
    background-image: url('/assets/images/hero-banner.jpg');
    background-size: cover;
    background-position: center;
}

a {
    color: azure;
}

/* Pagination Styles */
.pagination {
    flex-wrap: wrap;
    /* Allow pagination items to wrap on small screens */
}

.page-item {
    margin: 2px;
    /* Add spacing between pagination items */
}

.page-link {
    padding: 0.5rem 0.75rem;
    /* Adjust padding for smaller screens */
    font-size: 0.875rem;
    /* Reduce font size for smaller screens */
}

@media (max-width: 767.98px) {
    .pagination {
        justify-content: center;
        /* Center pagination on small screens */
    }

    .page-link {
        padding: 0.375rem 0.5rem;
        /* Further reduce padding for very small screens */
        font-size: 0.75rem;
        /* Further reduce font size for very small screens */
    }
}
</style>