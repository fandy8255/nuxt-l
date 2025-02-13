<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-3">
                <Followings />
            </div>
            <div class="col-6">
           
                <PostComponent @updateFeed="updateFeed" />

                <div id="feed_container" class="container" v-if="feedItems.length > 0">
                    <div v-for="item in paginatedFeedItems" :key="item.id" class="feed-item">
                        <div class="container" v-if="item.type === 'post'">
                       
                            <MessageCard :message="item" />
                        </div>
                        <div v-else-if="item.type === 'product'">
                     
                            <ProductCard :product="transformProduct(item)" :isAd="false" width="700px" />
                        </div>
                        
                    </div>

                    <!-- Pagination Controls -->
                    <nav aria-label="Page navigation" class="mt-4 bg-light">
                        <ul class="pagination justify-content-start bg-light">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="changePage(1)">First</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                            </li>
                            <li v-for="page in visiblePages" :key="page" class="page-item"
                                :class="{ active: page === currentPage }">
                                <button class="page-link" @click="changePage(page)">{{ page }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="changePage(totalPages)">Last</button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div v-else>
                    <p>No items to display in your feed.</p>
                </div>
            </div>
            <div class="col-3">
                <TopUsers />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();
const followed = userStore.followed;
const feedItems = ref([]);

function updateFeed(){
    console.log('feed update triggered 2nd time')
    feedItems.value=userStore.feed
}

const currentPage = ref(1);
const itemsPerPage = 2; 

const totalPages = computed(() => Math.ceil(feedItems.value.length / itemsPerPage));
const paginatedFeedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return feedItems.value.slice(start, end);
});

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

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 0);
    }
};

const transformProduct = (item) => {
    return {
        id: item.id,
        user_id: item.user_id,
        product_name: item.product_name,
        product_description: item.product_description,
        product_url: item.product_url,
        product_price: item.product_price,
        like_count: item.like_count,
        created_at: item.created_at,
        profile_picture: item.profile_picture || '/default-profile-picture.jpg',
        username: item.username || 'Unknown User',
        product_category: item.product_category || 'Uncategorized'
    };
};

onMounted(() => {
    feedItems.value=Array.from(userStore.feed)
});
</script>

<style scoped>
.feed-item {
    border: none;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    width: fit-content;
}

#feed_container {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
}

.feed-item h3 {
    margin-top: 0;
}

.feed-item p {
    margin: 0.5rem 0;
}

.feed-item small {
    color: #666;
}

.product_card {
    max-height: 80vh !important;
    max-width: 60vw !important;
}

.message-card{
    width: 700px;
}
</style>