<template>
    <div>
        <!-- User Listing -->
        <div v-if="pending" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="container">
                <FilterUsersComponent @update-users="updateUsers" />
            </div>

            <div v-if="paginatedUsers" class="container">
                <div class="row mt-5">
                    <div v-for="(user, index) in paginatedUsers" :key="index" class="col-sm-12 col-lg-3 p-2">
                        <UserCard :username="user.username" :profilePicture="user.profile_picture"
                            :profileDescription="user.profile_description" :ubicacion="user.ubicacion"
                            :verified="user.verified" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="container">
                <nav aria-label="Page navigation" class="mt-4">
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
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentPage = ref(1);
const itemsPerPage = 4; // Number of users per page
const runtimeConfig = useRuntimeConfig();
const nuxtApp = useNuxtApp()

// Fetch users using useAsyncData with caching
const { data: users } = await useAsyncData(async () => {
    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
        },
    });

    const parsed = await response.json();
    users.value = parsed.data.results;
    return parsed.data.results
},
    {
        transform(payload) {
            return {
                ...payload,
                fetchedAt: new Date(),
            }
        }, getCachedData(key) {
            const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]

            if (!data) {
                return
            }
            const expiration = new Date(data.fetchedAt)
            expiration.setTime(expiration.getTime() + 30 * 1000)
            const isExpired = expiration.getTime() < Date.now()

            if (isExpired) {
                return
            }
            return data
        }
    }
);

const updateUsers = (fetchedUsers) => {
    users.value = fetchedUsers;
};

// Pagination logic
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return users.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5; // Number of visible pagination buttons
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);

    // Adjust startPage and endPage if they go out of bounds
    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }

    // Generate the range of pages
    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    return pages;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
};
</script>

<style scoped>
.pagination .page-item.active .page-link {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
}
</style>