<template>
    <div>
        <div class="container mt-5" v-if="!loading">
            <div v-if="isBlocked">
                <div class="row">
                    <div class="col-12">
                        <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />
                    </div>

                    <div class="col-12 p-1 text-center justify-content-center mb-5">
                        <div class="container border rounded text-center p-2" style="width: fit-content !important;">
                            <div class="d-flex my-2 justify-content-between p-2" style="width: 100%;">
                                <h4>
                                    {{ user.username }}
                                </h4>
                                <div>
                                    <BlockComponent :viewedUsername="user.username" />
                                </div>
                            </div>
                            <NuxtImg provider="bunny" :src="user.profile_picture" height="auto" width="300px"
                                :quality="50" placeholder="/assets/images/panty-icon.png" />
                            <div class="d-flex my-2 text-center justify-content-center">
                                <div class="d-flex" style="width: fit-content;">
                                    <div class="me-3">
                                        Seguidores <i class="fa-solid fa-user"></i> {{ followers ? followers.length :
                                        0}}
                                    </div>
                                    <div>
                                        Siguiendo <i class="fa-solid fa-user"> </i> {{ followed ? followed.length : 0 }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-else>
                <div v-if="user">
                    <div class="row">
                        <div class="col-12">
                            <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />
                        </div>
                        <!-- Profile Section -->
                        <div class="col-4 p-2 text-center">
                            <div class="container border rounded text-center">
                                <NuxtImg provider="bunny" :src="user.profile_picture" height="auto" width="300px"
                                    :quality="50" placeholder="/assets/images/panty-icon.png" />
                            </div>
                            <div class="d-flex my-2">
                                <div class="me-3">
                                    Seguidores <i class="fa-solid fa-user"></i> {{ followers ? followers.length : 0 }}
                                </div>
                                <div>
                                    Siguiendo <i class="fa-solid fa-user"> </i> {{ followed ? followed.length : 0 }}
                                </div>
                            </div>
                        </div>
                        <div class="col-8">

                            <div class="d-flex" v-if="isAd">
                                <BanComponent class="p-2" :userId="user.id" v-if="!user.is_banned" />
                                <UnbanComponent :userId="user.id" v-else />
                            </div>
                            <div class="d-flex gap-2" v-else>
                                <FollowButton v-if="user.username !== userStore.username"
                                    :viewedUsername="user.username" />
                                <BlockComponent v-if="user.username !== userStore.username"
                                    :viewedUsername="user.username" />
                            </div>

                            <h2>{{ user.username }}
                                <span v-if="user.verified">
                                    <i class="fa fa-check-circle text-success"></i>
                                </span>
                            </h2>
                            <p><strong>Edad:</strong> {{ user.age }}</p>
                            <p><strong>Descripción:</strong></p>
                            <textarea class="form-control" rows="4" disabled>{{ user.profile_description }}</textarea>
                            <p><strong>Ubicación:</strong> {{ user.ubicacion }}</p>
                            <p><strong>Tipo de Usuario:</strong> {{ user.user_type }}</p>
                        </div>
                    </div>

                    <!-- Tabs Section -->
                    <div class="mt-4">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a id="products-title" class="nav-link" :class="{ active: activeTab === 'products' }"
                                    v-if="user.user_type === 'seller'" @click.prevent="activeTab = 'products'">
                                    Productos
                                </a>
                            </li>
                            <li class="nav-item">
                                <a id="contact-title" class="nav-link" :class="{ active: activeTab === 'contact' }"
                                    @click.prevent="activeTab = 'contact'">
                                    Contacto
                                </a>
                            </li>
                        </ul>

                        <div class="tab-content mt-3">
                            <!-- Products Tab -->
                            <div v-if="activeTab === 'products' && user.user_type === 'seller'"
                                class="tab-pane fade show active">
                                <div v-if="loading" class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="container">
                                        <div class="row">
                                            <FileUploadForm @updateProductsStore="updateProducts"
                                                v-if="userStore.username === username" @success="handleSuccess" />
                                        </div>
                                        <div class="row">
                                            <div v-for="product in paginatedProducts" :key="product.id"
                                                class="col-sm-12 col-lg-3 p-2">
                                                <ProductCard :product="product" :isAd="isAd" width="300px"
                                                    @updateProductsStore2="updateProducts" />
                                            </div>
                                        </div>
                                        <!-- Pagination Controls -->
                                        <nav aria-label="Page navigation" class="mt-4 bg-light">
                                            <ul class="pagination justify-content-start bg-light">
                                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                    <button class="page-link" @click="changePage(1)">Primero</button>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                    <button class="page-link"
                                                        @click="changePage(currentPage - 1)">Anterior</button>
                                                </li>
                                                <li v-for="page in visiblePages" :key="page" class="page-item"
                                                    :class="{ active: page === currentPage }">
                                                    <button class="page-link" @click="changePage(page)">{{ page
                                                        }}</button>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                    <button class="page-link"
                                                        @click="changePage(currentPage + 1)">Siguiente</button>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                    <button class="page-link"
                                                        @click="changePage(totalPages)">Último</button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <!-- Contact Tab -->
                            <div v-if="activeTab === 'contact' && user.username !== userStore.username"
                                class="tab-pane fade show active">
                                <ContactForm :receiver="user" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="row w-100 d-flex justify-content-center align-items-center my-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div v-else>
            <div class="row w-100 d-flex justify-content-center align-items-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const user = ref(null);
const loading = ref(true);
const activeTab = ref("products");
const userStore = useUserStore();
const isAd = ref(0);

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 2;
const usernameSlug = ref('');
const username = useRoute().params.username[0];
const followed = ref(null);
const followers = ref(null);

function test() {
    console.log('emmited');
    loadUserData();
}

const message = ref(null); 

const handleSuccess = (data) => {
    message.value = data; 
};

const clearMessage = () => {
    message.value = null; 
};

function updateProducts() {
    loadUserData();
}

const isBlocked = computed(() => {
    return userStore.blocked_users.some(elem => elem.username === username) || userStore.blocked_by.some(elem => elem.username === username)
})
    ;

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return products.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

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

const fetchUser = async (usernameSlug) => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/user?username=${usernameSlug}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        user.value = data;
    } catch (error) {
        user.value = null;
    }
};

const fetchFollowers = async (user) => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/followers`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        followers.value = data.followers;
    } catch (error) {

        followers.value = null;
    }
};

const fetchFollowed = async (user) => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/followed`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        followed.value = data.followed;
    } catch (error) {
        followed.value = null;
    }
};

const fetchProducts = async () => {
    loading.value = true;
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts?user_id=${user.value.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            }
        });
        const data = await response.json();
        products.value = data.data.results;
    } catch (error) {
    } finally {
        loading.value = false;
    }
};

const loadUserData = async () => {
    usernameSlug.value = useRoute().params.username[0];

    if (usernameSlug.value === userStore.username) {
       
        user.value = {
            id: userStore.id,
            username: userStore.username,
            age: userStore.age,
            profile_description: userStore.profile_description,
            profile_picture: userStore.profile_picture,
            ubicacion: userStore.ubicacion,
            user_type: userStore.user_type,
        };

        if (userStore.user_type === "seller") {
            products.value = Array.from(userStore.products);
        }
    } else {
       
        await fetchUser(usernameSlug.value).then(async res => {
            await fetchFollowed(user.value);
            await fetchFollowers(user.value);

            if (user.value.user_type === "seller") {
                fetchProducts();
            }
        });
    }
};

onMounted(async () => {
    const currentUserSuper = await userStore.isAd().then(res => isAd.value = res);
    loadUserData().then(res => loading.value = false);

});
</script>

<style scoped>
#contact-title,
#products-title {
    color: dimgrey !important;
}

.product_card {
    max-height: 60vh !important;
}
</style>