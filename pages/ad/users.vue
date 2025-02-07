<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- User Table -->
        <div class="container-fluid" v-else>
            <div class="container">
                <!-- Filter Component -->
                <FilterUsersAdvancedComponent @update-users="updateUsers" />
            </div>

            <div v-if="paginatedUsers" class="container-xl d-flex justify-content-center mt-4">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th @click="sortByColumn('id')">
                                ID
                                <span v-if="sortBy === 'id'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Profile Description</th>
                            <th @click="sortByColumn('user_type')">
                                User Type
                                <span v-if="sortBy === 'user_type'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('ubicacion')">
                                Ubicación
                                <span v-if="sortBy === 'ubicacion'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('age')">
                                Age
                                <span v-if="sortBy === 'age'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('verified')">
                                Verified
                                <span v-if="sortBy === 'verified'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('is_banned')">
                                Banned
                                <span v-if="sortBy === 'is_banned'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('created_at')">
                                Created At
                                <span v-if="sortBy === 'created_at'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>Banned Until</th>
                            <th @click="sortByColumn('reported_user_count')">
                                Reported Products (Seller)
                                <span v-if="sortBy === 'reported_user_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('reported_by_user_count')">
                                Reported By User
                                <span v-if="sortBy === 'reported_by_user_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('blocked_by_count')">
                                Blocked By Count
                                <span v-if="sortBy === 'blocked_by_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('blocked_user_count')">
                                Blocked User Count
                                <span v-if="sortBy === 'blocked_user_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('product_count')">
                                Product Count
                                <span v-if="sortBy === 'product_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('thread_count')">
                                Thread Count
                                <span v-if="sortBy === 'thread_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in paginatedUsers" :key="index">
                            <td>
                                <small>{{ user.id }}</small>
                            </td>
                            <td>
                                <UserImgComponent :image="user.profile_picture ? user.profile_picture : ''"
                                    :username="user.username" />
                            </td>
                            <td>{{ user.email }}</td>
                            <td><!-- {{ user.profile_description && user.profile_description.length < 50 ? user.profile_description : user.profile_description.slice(50) }}-->
                            </td>
                            <td>{{ user.user_type }}</td>
                            <td>{{ user.ubicacion }}</td>
                            <td>{{ user.age }}</td>
                            <td>{{ user.verified ? 'Yes' : 'No' }}</td>
                            <td>{{ user.is_banned ? 'Yes' : 'No' }}</td>
                            <td>{{ new Date(user.created_at).toLocaleDateString('en-GB') }}</td>
                            <td>{{ user.banned_until ? new Date(user.banned_until).toLocaleString() : 'N/A' }}</td>
                            <td>{{ user.reported_user_count }}</td>
                            <td>{{ user.reported_by_user_count }}</td>
                            <td>{{ user.blocked_by_count }}</td>
                            <td>{{ user.blocked_user_count }}</td>
                            <td>{{ user.product_count }}</td>
                            <td>{{ user.thread_count }}</td>
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

const userStore = useUserStore();

const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // Increase items per page for better table display
const visibleButtons = 5;
const loading = ref(true);

// Sorting state
const sortBy = ref(''); // Current column to sort by
const sortDirection = ref('asc'); // Current sorting direction

// Fetch users from the Cloudflare Worker
const fetchUsers = async () => {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const navbarStore = useNavbarStore();
    const signature = await navbarStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    });

    const parsed = await response.json();
    console.log('admin user parsed', parsed);
    users.value = parsed.data.results;
};

onMounted(async () => {
    await fetchUsers().finally(() => (loading.value = false));
});

const updateUsers = (fetchedUsers) => {
    console.log('got the emit');
    users.value = fetchedUsers;
};

// Handle sorting by column
const sortByColumn = async (column) => {

    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const navbarStore = useNavbarStore();
    const signature = await navbarStore.generateHMACSignature(timestamp);

    if (sortBy.value === column) {
        // Toggle sorting direction if the same column is clicked again
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        // Sort by the new column in ascending order by default
        sortBy.value = column;
        sortDirection.value = 'asc';
    }

    // Fetch sorted data from the API
    const params = new URLSearchParams();
    params.append('sortBy', sortBy.value);
    params.append('sortDirection', sortDirection.value);

    fetch(`https://lingerie.fandy8255.workers.dev/api/ad/users?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('aftersortt ', data.data.results)
            users.value = data.data.results;
        })
        .catch((error) => {
            console.error('Error sorting users:', error);
        });
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

th {
    cursor: pointer;
    /* Make headers clickable */
}
</style>