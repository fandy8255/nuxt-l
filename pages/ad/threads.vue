<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Threads Table -->
        <div class="container-fluid" v-else>
            <div class="container">
                <FilterSortSearchThreads @update-threads="updateThreads" />
            </div>

            <div v-if="paginatedThreads" class="container-fluid d-flex justify-content-center mt-4">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th @click="sortByColumn('thread_id')">
                                Thread ID
                                <span v-if="sortBy === 'thread_id'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('thread_title')">
                                Title
                                <span v-if="sortBy === 'thread_title'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('sender_username')">
                                Sender
                                <span v-if="sortBy === 'sender_username'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('receiver_username')">
                                Receiver
                                <span v-if="sortBy === 'receiver_username'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('created_at')">
                                Created At
                                <span v-if="sortBy === 'created_at'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('last_updated_at')">
                                Last Updated
                                <span v-if="sortBy === 'last_updated_at'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('message_count')">
                                Messages
                                <span v-if="sortBy === 'message_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>
                                Thread
                            </th>
                            <th>
                                Receiver Threads
                            </th>
                            <th>
                                Sender Threads
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(thread, index) in paginatedThreads" :key="index">
                            <td>
                                <small>{{ thread.thread_id }}</small>
                            </td>
                            <td>{{ thread.thread_title }}</td>
                            <td>
                                <UserImgComponent :image="thread.sender_profile_picture"
                                    :username="thread.sender_username" />
                                
                            </td>
                            <td>
                                <UserImgComponent :image="thread.receiver_profile_picture"
                                    :username="thread.receiver_username" />
                                
                            </td>
                            <td>{{ new Date(thread.created_at).toLocaleDateString('en-GB') }}</td>
                            <td>{{ new Date(thread.last_updated_at).toLocaleDateString('en-GB') }}</td>
                            <td>{{ thread.message_count }}</td>
                            <td>
                                <NuxtLink :to="`/ad/mensajes/${thread.thread_id}`">
                                    Thread
                                </NuxtLink>
                            </td>
                            <td>
                                <NuxtLink :to="`/ad/mensajes/user/${thread.receiver}`">
                                    Receiver Threads
                                </NuxtLink>
                            </td>
                            <td>
                                <NuxtLink :to="`/ad/mensajes/user/${thread.sender}`">
                                    Sender Threads
                                </NuxtLink>
                            </td>
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

const threads = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; 
const visibleButtons = 5; 
const loading = ref(true);
const sortBy = ref(''); 
const sortDirection = ref('asc'); 

useSeoMeta({
  title: 'Ad Threads',
  description: 'Ad Threads',
  robots: 'noindex', 
});

const fetchThreads = async () => {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const navbarStore = useNavbarStore();
    const signature = await navbarStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/threads`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    });

    const parsed = await response.json();
    threads.value = parsed.data.results;
};

onMounted(async () => {
    await fetchThreads().finally(() => (loading.value = false));
});


const updateThreads = (fetchedThreads) => {
    threads.value = fetchedThreads;
};


const sortByColumn = (column) => {
    if (sortBy.value === column) {
       
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        
        sortBy.value = column;
        sortDirection.value = 'asc';
    }

    threads.value.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (valA == null) valA = "";
        if (valB == null) valB = "";

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
    });
};

// Pagination logic
const totalPages = computed(() => Math.ceil(threads.value.length / itemsPerPage));
const paginatedThreads = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return threads.value
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
}
</style>