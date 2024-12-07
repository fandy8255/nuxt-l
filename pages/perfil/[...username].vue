<template>
    <div class="container mt-5">
        <div v-if="user">
            <div class="row">
                <!-- Profile Section -->
                <div class="col-4 p-2 text-center">
                    <div class="container border rounded text-center">
                        <NuxtImg provider="bunny" :src="user.profile_picture" height="auto" width="300px" :quality="50" placeholder="/assets/images/panty-icon.png" />
                    </div>
                    
                </div>
                <div class="col-8">
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
                                    <FileUploadForm v-if="userStore.username===username" />
                                </div>
                                <div class="row">
                                    <div v-for="product in paginatedProducts" :key="product.id"
                                        class="col-sm-12 col-lg-3 p-2">
                                        
                                        <ProductCard :imgSrc="product.product_url" :productTitle="product.product_name"
                                            :productDescription="product.product_description"
                                            :prodPath="'/tienda/' + product.product_url"
                                            :productCategory="product.product_category"
                                            :productPrice="product.product_price" />
                                        
                                           <!--{{product }} -->
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
                                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link"
                                                @click="changePage(currentPage + 1)">Siguiente</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link" @click="changePage(totalPages)">Último</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Tab -->
                    <div v-if="activeTab === 'contact'" class="tab-pane fade show active">
                        <form @submit.prevent="submitContactForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre</label>
                                <input type="text" id="name" class="form-control" v-model="contactForm.name" required />
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Mensaje</label>
                                <textarea id="message" class="form-control" rows="5" v-model="contactForm.message"
                                    required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center mt-5">No se encontró el usuario.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from "vue";

const user = ref(null);
const loading = ref(false);
const activeTab = ref("products");
const contactForm = ref({ name: "", message: "" });
const userStore = useUserStore();

// State for pagination
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3;
const usernameSlug = ref('');
const runtimeConfig = useRuntimeConfig();
const username= useRoute().params.username[0]

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return products.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const visiblePages = computed(() => {
    const pages = [];
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    return pages;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const fetchUser = async (usernameSlug) => {
    try {
        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/user?username=${usernameSlug}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        user.value = data;
    } catch (error) {
        console.error(error);
        user.value = null;
    }
};


const fetchProducts = async () => {
    loading.value = true;
    console.log('u-id', user.value.id)
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts?user=${user.value.id}`, {
            method :'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            }
        });
        const data = await response.json();
        console.log('products', data.data.results)
        products.value = data.data.results;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const loadUserData = () => {
    usernameSlug.value = useRoute().params.username[0];

    if (usernameSlug.value === userStore.username) {
        console.log('fetched from store')
        // Use data from Pinia store for authenticated user
        user.value = {
            id:userStore.id,
            username: userStore.username,
            age: userStore.age,
            profile_description: userStore.profile_description,
            profile_picture: userStore.profile_picture,
            ubicacion:userStore.ubicacion,
            user_type: userStore.user_type,
        };
        //fetchProducts()
    } else {
        // Fetch data for other users
        fetchUser(usernameSlug.value);
    }
};

const submitContactForm = () => {
    console.log("Contact Form Submitted:", contactForm.value);
};

onMounted(() => {
    console.log('mounted')
    loadUserData()
    //console.log('usr value',user.value)
    //console.log('usr type',user.value.user_type )
    if(user.value && user.value.user_type==='seller'){
        console.log('fetching products')
        fetchProducts()
    }
});


</script>

<style>
#contact-title,#products-title{
    color: dimgrey !important;
}
</style>