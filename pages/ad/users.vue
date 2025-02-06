<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- User Table -->
        <div v-else>
            <div class="container">
                <FilterUsersComponent @update-users="updateUsers" />
            </div>

            <div v-if="paginatedUsers" class="container mt-4">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Profile Picture</th>
                            <th>Profile Description</th>
                            <th>User Type</th>
                            <th>Ubicación</th>
                            <th>Age</th>
                            <th>Verified</th>
                            <th>Admin</th>
                            <th>Banned</th>
                            <th>Created At</th>
                            <th>Banned Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in paginatedUsers" :key="index">
                            <td>{{ user.id }}</td>
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <td>
                                <img :src="user.profile_picture" alt="Profile Picture" class="img-thumbnail" width="50"
                                    height="50" />
                            </td>
                            <td>{{ user.profile_description }}</td>
                            <td>{{ user.user_type }}</td>
                            <td>{{ user.ubicacion }}</td>
                            <td>{{ user.age }}</td>
                            <td>{{ user.verified ? 'Yes' : 'No' }}</td>
                            <td>{{ user.is_admin ? 'Yes' : 'No' }}</td>
                            <td>{{ user.is_banned ? 'Yes' : 'No' }}</td>
                            <td>{{ new Date(user.created_at).toLocaleString() }}</td>
                            <td>{{ user.banned_until ? new Date(user.banned_until).toLocaleString() : 'N/A' }}</td>
                        </tr>
                    </tbody>
                </table>
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
const userStore = useUserStore();

const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // Increase items per page for better table display
const visibleButtons = 5;
const loading = ref(true);

/*
definePageMeta({
    middleware: ['auth']
});
*/

// Fetch users from the Cloudflare Worker
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

// Pagination logic
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

.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
    border-top: 2px solid #dee2e6;
}

.img-thumbnail {
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    max-width: 100%;
    height: auto;
}
</style>