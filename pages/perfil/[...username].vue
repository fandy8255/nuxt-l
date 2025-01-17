<template>
    <div class="container mt-5">
        <div v-if="user">
            <div class="row">
                <div class="col-12">
                    <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />
                </div>
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
                                    <FileUploadForm @updateProductsStore="updateProducts" v-if="userStore.username===username" @success="handleSuccess" />
                                </div>
                                <div class="row">
                                    <div v-for="product in paginatedProducts" :key="product.id"
                                        class="col-sm-12 col-lg-3 p-2" >
                                    
                                        <ProductCard
                                            :product="product"
                                            :imgSrc="product.product_url" 
                                            :productTitle="product.product_name"
                                            :productDescription="product.product_description"
                                            :prodId="product.id"
                                            :productCategory="product.product_category"
                                            :productPrice="product.product_price"
                                            :username="product.username"
                                            :usernamePicture="product.profile_picture"
                                            @updateProductsStore2="updateProducts"
                                            
                                             />
                                    
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
                    <ContactForm :receiver="user" />
                       
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
import { ref, computed, onMounted} from "vue";

const user = ref(null);
const loading = ref(false);
const activeTab = ref("products");

const userStore = useUserStore();

// State for pagination
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;
const usernameSlug = ref('');
const runtimeConfig = useRuntimeConfig();
const username= useRoute().params.username[0]

function test(){
    console.log('emmitedd update store after deleting prod')
    loadUserData()
}

const message = ref(null); // State for the modal message

const handleSuccess = (data) => {
    message.value = data; // Set the modal message
};

const clearMessage = () => {
    message.value = null; // Clear the modal message
};

function updateProducts(){
    console.log('emmitedd update store')
    loadUserData()
}

/*
function updatedProds(){
    console.log('triggered')
    products.value=Array.from(userStore.products)
    console.log(userStore.products)
}
*/

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
        /*console.log('user data', data)*/
    } catch (error) {
        console.error(error);
        user.value = null;
    }
};


const fetchProducts = async () => {
    loading.value = true;
    /*console.log('u-id', user.value.id)*/
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts?user_id=${user.value.id}`, {
            method :'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            }
        });
        const data = await response.json();
        /*console.log('products', data.data.results)*/
        products.value = data.data.results;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const loadUserData = async() => {
    usernameSlug.value = useRoute().params.username[0];

    if (usernameSlug.value === userStore.username) {
        /*console.log('fetched from store')*/
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

        
        if (userStore.user_type==="seller"){
            console.log('fetched products from store')
            //console.log('just before refreshing prods', userStore.products)
            products.value=Array.from(userStore.products)
            console.log('prods', products.value)
        }

        //fetchProducts()
    } else {
        // Fetch data for other users
        await fetchUser(usernameSlug.value).then(res=>{
            /*console.log('user value', user.value)*/
            
            if(user.value.user_type==="seller"){
                fetchProducts()
            }
        })
        
    }
};


onMounted(() => {
    console.log('mounted')
    loadUserData()
    //console.log('store productssss', userStore.products)
    //console.log('user store', userStore)
});


</script>

<style scoped>
#contact-title,#products-title{
    color: dimgrey !important;
}
</style>