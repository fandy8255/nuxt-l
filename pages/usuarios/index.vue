<template>
    <div>
        <!-- User Listing -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
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
import { ref, computed, onMounted } from 'vue';
//import FilterUsersComponent from '~/components/FilterUsersComponent.vue';
//import UserCard from '~/components/UserCard.vue';

const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 4;
const visibleButtons = 5;
const loading = ref(true);
const runtimeConfig = useRuntimeConfig();

// Fetch users from the Cloudflare Worker
const fetchUsers = async () => {
    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
        },
    });

    const parsed = await response.json();
    console.log('parsed', parsed.data.results)
    users.value = parsed.data.results;
};

onMounted(async () => {
    await fetchUsers().finally(() => (loading.value = false));
});

const updateUsers = (fetchedUsers) => {
    users.value = fetchedUsers;
};

// Pagination logic
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    console.log('paginated users', users.value.slice(start, end))
    let chunk = users.value[start, end]
    //return chunk ? users.value.slice(start, end) : users.value.slice(start)
    if (chunk) {
        return users.value.slice(start, end)
    } else {
        return users.value.slice(start)
    }
});

const visiblePages = computed(() => {
    const pages = [];
    const half = Math.floor(visibleButtons / 2);
    const startPage = Math.max(1, currentPage.value - half);
    const endPage = Math.min(totalPages.value, startPage + visibleButtons - 1);

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }
    return pages;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
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