<template>
    <footer v-if="isHydrated" class="text-light py-5"
        style="display: flex !important; flex-direction: column !important;">
        <div class="container">
            <!-- Footer Links -->
            <div class="row text-center text-md-start">
                <!-- Categorías -->
                <div class="col-12 col-md-3 mb-4">
                    <h5 class="fw-bold mb-3">Categorías</h5>
                    <ul class="list-unstyled">
                        <li v-for="category in categories" :key="category" class="mb-2 text-center">
                            <NuxtLink :to="'#'" class="text-decoration-none text-light">
                                {{ category }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Modelos -->
                <div class="col-12 col-md-3 mb-4" v-if="userStore.logged_in">
                    <h5 class="fw-bold mb-3">Modelos</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2 text-center">
                            <NuxtLink :to="`/usuarios`" class="text-decoration-none text-light">
                                Vendedoras
                            </NuxtLink>
                        </li>
                        <li class="mb-2 text-center">
                            <NuxtLink :to="`/tienda`" class="text-decoration-none text-light">
                                Tienda
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-3 mb-4" v-else>
                    <h5 class="fw-bold mb-3">Modelos</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2 text-center">
                            <NuxtLink :to="`/landing/vendedoras`" class="text-decoration-none text-light">
                                Vendedoras
                            </NuxtLink>
                        </li>
                        <li class="mb-2 text-center">
                            <NuxtLink :to="`/landing/tienda`" class="text-decoration-none text-light">
                                Tienda
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="col-12 col-md-3 mb-4">
                    <NuxtLink :to="`/revista`" class="text-decoration-none text-light">
                        <h5 class="fw-bold mb-3">Revista</h5>
                    </NuxtLink>
                    <ul class="list-unstyled">
                        <li v-for="category in magCategories" :key="category" class="mb-2 text-center">
                            <NuxtLink :to="`/revista/category/${category}`" class="text-decoration-none text-light">
                                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-3 mb-4" v-if="userStore.logged_in">
                    <h5 class="fw-bold mb-3">Contacto</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2 text-center">
                            <h6 class="text-light"> support@latinpanty.com </h6>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-3 mb-4" v-else>
                    <h5 class="fw-bold mb-3">Contáctanos</h5>
                    <ul class="list-unstyled">
                        <li class="text-center">
                            <NuxtLink :to="`/contacto`" class="text-decoration-none text-light">
                                Contacto
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>


        </div>
        <div class="container text-center">
            <p>&copy; {{ new Date().getFullYear() }} Latin Panty. Todos Los Derechos Reservados.</p>
            <div>

                <a href="#" class="text-light mx-2">Facebook</a>
                <a href="#" class="text-light mx-2">Instagram</a>
                <a href="#" class="text-light mx-2">Twitter</a>
            </div>
        </div>
    </footer>
</template>

<script setup>

import { ref } from 'vue';
const email = ref('');
const subscriptionSuccess = ref(false);
const userStore = useUserStore();
const isHydrated = ref(false);

const categories = ['Colombia', 'Argentina', 'Peru', 'Uruguay', 'Brazil', 'Ecuador'];
const magCategories = ['onlyfans', 'instagram'];

onMounted(() => {
    isHydrated.value = true;
});

const subscribe = () => {
    subscriptionSuccess.value = true;
    setTimeout(() => (subscriptionSuccess.value = false), 3000);
};
</script>

<style scoped>
h5 {
    text-align: center !important;
}

footer {
    /*background: rgb(205, 89, 213) !important;*/
    background: rgba(219, 74, 132) !important;
}

footer ul {
    list-style: none;
    padding: 0;
}

footer ul li a {
    text-decoration: none;
    color: #ffffff;
}

footer ul li a:hover {
    text-decoration: underline;
}
</style>