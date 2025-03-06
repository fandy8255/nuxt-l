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
                    <div v-for="user in paginatedUsers" :key="user.id" class="col-sm-12 col-lg-3 p-2">

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
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3;
const visibleButtons = 5;
const loading = ref(true);
const userStore = useUserStore();

useSeoMeta({
    title: 'Latin Panty | Uusarios',
    description: 'Latin Panty | Usuarios',
    robots: 'noindex',
});

definePageMeta({
    middleware: ['auth']
});

const fetchUsers = async () => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
        },
    });

    const parsed = await response.json();
    users.value = parsed.data.results;
};

onMounted(async () => {
    await fetchUsers().finally(() => (loading.value = false));
});

const updateUsers = (fetchedUsers) => {
    users.value = fetchedUsers;
};

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return users.value.slice(start, end);
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

@media (max-width: 900px) {
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

    img {
        max-height: 100vh;
    }
}

img {
    max-height: 60vh;
}
</style>