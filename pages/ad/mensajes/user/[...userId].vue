<template>
    <div>
        <div class="container">
            <h3 class="my-4">Mis Conversaciones</h3>
            <div v-if="loading" class="text-center mt-5"
                style="height: 600px !important; margin-top: 100px !important;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else>

                <div v-if="threads && threads.length === 0" class="alert alert-info">No tienes conversaciones aún.</div>
                <div v-for="thread in paginatedThreads" :key="thread.thread_id" class="card mb-2">
                    <div class="card-body d-flex align-items-center">

                        <NuxtImg provider="bunny" :src="getProfileImage(thread)" class="rounded-circle me-2"
                            width="50px" height="50px" alt="User Image" :quality="10" loading="lazy"
                            placeholder="/assets/images/panty-icon.jpg" />

                        <div class="container d-flex align-items-center">
                            <div class="col-4">
                                <h6 class="card-title">{{ getThreadPartnerName(thread) }}</h6>
                            </div>
                            <div class="col-4">
                                <NuxtLink :to="`/ad/mensajes/${thread.thread_id}`">
                                    <p class="card-text mb-1 text-muted">{{ thread.last_message ?
                                        thread.last_message.slice(0, 50) : 'Sin mensajes' }}</p>
                                </NuxtLink>

                            </div>
                            <div class="col-4 text-end">
                                <small class="text-muted">{{ formatDate(thread.last_updated_at) }}</small>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>

        <!-- Pagination -->
        <nav v-if="threads.length > threadsPerPage">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Siguiente</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';

const navbarStore = useNavbarStore();
const loading = ref(true)
const userId = useRoute().params.userId[0].toString();
const threads = ref([]);
const threadsPerPage = 3;
const currentPage = ref(1);

useSeoMeta({
  title: 'Mensajes User',
  description: 'Mensajes User.',
  robots: 'noindex', 
});

const paginatedThreads = computed(() => {
    const start = (currentPage.value - 1) * threadsPerPage;
    //return threads.value.slice(start, start + threadsPerPage);
    return threads.value
});

const totalPages = computed(() => Math.ceil(threads.value.length / threadsPerPage));

const fetchThreads = async () => {
    try {
        const timestamp = Date.now().toString(); // Prevent replay attacks
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const user = await navbarStore.getUser()

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/user/threads?userId=${userId}`, {
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user)
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch threads');
        }
        const data = await response.json()
        threads.value = data

    } catch (error) {
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const getProfileImage = (thread) => {
    
    const partnerIsReceiver = thread.sender === userId;
    return partnerIsReceiver
        ? thread.receiver_profile_picture
        : thread.sender_profile_picture;
};

const getThreadPartnerName = (thread) => {
    
    const partnerIsReceiver = thread.sender === userId;
    return partnerIsReceiver
        ? thread.receiver_name
        : thread.sender_name;
};
const formatDate = (date) => new Date(date).toLocaleString();

onMounted(() => {

    fetchThreads().then(res => {
        loading.value = false
    })
});
</script>

<style scoped>
.card {
    border: 1px solid #ddd;
}

.rounded-circle {
    object-fit: cover;
}
</style>