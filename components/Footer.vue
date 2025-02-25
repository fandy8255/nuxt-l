<template>
    <footer v-if="isHydrated" class="text-light py-5" style="display: flex !important; flex-direction: column !important;">
        <div class="container">
            <!-- Footer Links -->
            <div class="row text-center text-md-start">
                <!-- Categorías -->
                <div class="col-12 col-md-4 mb-4">
                    <h5 class="fw-bold mb-3">Categorías</h5>
                    <ul class="list-unstyled">
                        <li v-for="category in categories" :key="category" class="mb-2 text-center">
                            <NuxtLink :to="`/categorias/${category.toLowerCase()}`"
                                class="text-decoration-none text-light">
                                {{ category }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Modelos -->
                <div class="col-12 col-md-4 mb-4">
                    <h5 class="fw-bold mb-3">Modelos</h5>
                    <ul class="list-unstyled">
                        <li v-for="model in models" :key="model" class="mb-2 text-center">
                            <NuxtLink :to="`/modelos/${model.toLowerCase()}`" class="text-decoration-none text-light">
                                {{ model }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="col-12 col-md-4 mb-4" v-if="userStore.logged_in">
                    <h5 class="fw-bold mb-3">Revista</h5>
                    <ul class="list-unstyled">
                        <li v-for="model in models" :key="model" class="mb-2 text-center">
                            <NuxtLink :to="`/modelos/${model.toLowerCase()}`" class="text-decoration-none text-light">
                                {{ model }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="col-12 col-md-4 mb-4" v-else >
                    <h5 class="fw-bold mb-3">Suscríbete a nuestro Newsletter</h5>
                    <form @submit.prevent="subscribe">
                        <div class="mb-3">
                            <input v-model="email" type="email" placeholder="Ingresa tu correo" class="form-control"
                                required />
                        </div>
                        <button type="submit" class="btn btn-success w-100">Suscribirse</button>
                    </form>
                    <p v-if="subscriptionSuccess" class="mt-3 text-success">¡Gracias por suscribirte!</p>
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
const models = ['Nuevas Vendedoras', 'Vendedoras Top'];

onMounted(() => {
    isHydrated.value = true;
});

const subscribe = () => {
    subscriptionSuccess.value = true;
    setTimeout(() => (subscriptionSuccess.value = false), 3000);
};
</script>

<style scoped>

h5{
    text-align: center !important;
}

footer{
    background: rgb(205, 89, 213) !important;
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