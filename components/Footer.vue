<template>
    <footer class="text-light py-5" style="display: flex !important; flex-direction: column !important;">
        <div class="container">
            <!-- Footer Links -->
            <div class="row text-center text-md-start">
                <!-- Categorías -->
                <div class="col-12 col-md-4 mb-4">
                    <h3 class="h5 fw-bold mb-3">Categorías</h3>
                    <ul class="list-unstyled">
                        <li v-for="category in categories" :key="category" class="mb-2">
                            <NuxtLink :to="`/categorias/${category.toLowerCase()}`"
                                class="text-decoration-none text-light">
                                {{ category }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Modelos -->
                <div class="col-12 col-md-4 mb-4">
                    <h3 class="h5 fw-bold mb-3">Modelos</h3>
                    <ul class="list-unstyled">
                        <li v-for="model in models" :key="model" class="mb-2">
                            <NuxtLink :to="`/modelos/${model.toLowerCase()}`" class="text-decoration-none text-light">
                                {{ model }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="col-12 col-md-4 mb-4" v-if="userStore.logged_in">
                    <h3 class="h5 fw-bold mb-3 text-end">Revista</h3>
                    <ul class="list-unstyled">
                        <li v-for="model in models" :key="model" class="mb-2 text-end">
                            <NuxtLink :to="`/modelos/${model.toLowerCase()}`" class="text-decoration-none text-light">
                                {{ model }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="col-12 col-md-4 mb-4" v-else >
                    <h3 class="h5 fw-bold mb-3">Suscríbete a nuestro Newsletter</h3>
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
            <p>&copy; {{ new Date().getFullYear() }} Sustainable Clothinga. All rights reserved.</p>
            <div>
                <a href="#" class="text-light mx-2">Facebook</a>
                <a href="#" class="text-light mx-2">Instagram</a>
                <a href="#" class="text-light mx-2">Twitter</a>
            </div>
        </div>
    </footer>
</template>

<script setup>
// Links para las secciones de categorías y modelos
const categories = ['Hombres', 'Mujeres', 'Niños', 'Accesorios'];
const models = ['Vintage', 'Casual', 'Formal', 'Deportiva'];

// Variables para el formulario de suscripción
import { ref } from 'vue';
const email = ref('');
const subscriptionSuccess = ref(false);
const userStore = useUserStore();

// Función para manejar la suscripción
const subscribe = () => {
    // Aquí puedes agregar lógica para enviar el correo a tu backend
    subscriptionSuccess.value = true;
    setTimeout(() => (subscriptionSuccess.value = false), 3000);
};
</script>

<style scoped>

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