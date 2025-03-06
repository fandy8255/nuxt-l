<template>
    <nav v-if="isHydrated" class="navbar navbar-expand-lg navbar-dark bg-dark w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex align-items-center">
                <NuxtLink :to=" userStore.logged_in ? '/feed' : '/' " class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto ms-2 fw-bolder">Latin Panty</h4>
            </div>

            <!-- Navbar Toggler Button -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav" ref="navbarCollapse">
                <ul class="navbar-nav ms-auto gap-2 me-2" v-if="isAd">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Products</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none" @click="closeNavbar">Usuarios</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none" @click="closeNavbar">
                            <i class="fa-regular fa-envelope fa-xl me-2"></i>
                        </NuxtLink>
                    </li>

                    <li class="nav-item dropdown">
                        <div class="d-flex nav-link dropdown-toggle" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <div
                                style="display: flex !important; flex-direction: column; justify-content: center; align-items: center; padding: 0; color: aliceblue !important;">
                                Admin
                            </div>
                        </div>

                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <NuxtLink to="/perfil" class="dropdown-item" @click="closeNavbar">Cuenta</NuxtLink>
                            </li>
                            <li>
                                <button @click="signOut" class="dropdown-item">Sign Out</button>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto gap-2 me-2" v-else-if="userStore.logged_in">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Tienda</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none" @click="closeNavbar">Usuarios</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none" @click="closeNavbar">
                            <i class="fa-regular fa-envelope fa-xl me-2"> </i>{{ userStore.message_count }}
                        </NuxtLink>
                    </li>
                    <li v-if="userStore.user_type === 'seller'" class="nav-item">
                        <NuxtLink to="/dashboard" class="nav-link text-decoration-none" @click="closeNavbar">Stats</NuxtLink>
                    </li>

                    <li class="nav-item dropdown">
                        <div class="d-flex nav-link dropdown-toggle" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <NuxtImg provider="bunny" :src="userStore.profile_picture" class="rounded-circle me-2"
                                width="40px" height="40px" alt="User Image" :quality="10" loading="lazy"
                                placeholder="/assets/images/panty-icon.jpg" />
                            <div
                                style="display: flex !important; flex-direction: column; justify-content: center; align-items: center;padding: 0; color: aliceblue !important;">
                                {{ userStore.username }}
                            </div>
                        </div>

                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <NuxtLink to="/perfil" class="dropdown-item" @click="closeNavbar">Cuenta</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink :to="userStore.user_profile" class="dropdown-item" @click="closeNavbar">Perfil</NuxtLink>
                            </li>
                            <li>
                                <button @click="signOut" class="dropdown-item">Salir</button>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto gap-2" v-else>
                    <li>
                        <NuxtLink to="/landing/vendedoras" class="nav-link text-decoration-none" @click="closeNavbar">Vendedoras </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/landing/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Tienda
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/revista" class="nav-link text-decoration-none" @click="closeNavbar">Revista</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/login" class="nav-link text-decoration-none" @click="closeNavbar">Login</NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const navbarStore = useNavbarStore();
const router = useRouter();
const isHydrated = ref(false);
const { isAd } = defineProps(['isAd']);

// Reference to the navbar collapse element
const navbarCollapse = ref(null);

onMounted(async () => {
    isHydrated.value = true;
});

// Method to close the navbar
function closeNavbar() {
    if (navbarCollapse.value) {
        // Use Bootstrap's JavaScript API to hide the navbar
        const collapseInstance = new bootstrap.Collapse(navbarCollapse.value, {
            toggle: false, // Ensure it only hides
        });
        collapseInstance.hide(); // Hide the navbar
    }
}

async function signOut() {
    const { error } = await useSupabaseClient().auth.signOut();
    if (error) {
        //console.error(error);
    }
    userStore.signOut({
        username: '',
        email: '',
        id: '',
        age: null,
        user_type: '',
        profile_description: '',
        profile_picture: '',
        ubicacion: '',
        logged_in: false,
        user_tok: '',
        user_profile: '',
        products: [],
        followers: [],
        followed: [],
        liked_products: [],
        feed: [],
        blocked_users: [],
        blocked_by: [],
        message_count: 0
    });

    await navbarStore.isAd();

    router.push('/');
}
</script>

<style scoped>
a:hover,
button:hover {
    color: rgb(13, 0, 255)
}

.nav-link {
    font-weight: 600;
    font-style: normal;
    color: white !important;
}

nav {
    position: sticky !important;
    /*background: rgb(205, 89, 213) !important;*/
    background:rgba(206, 206, 206, 0.95) !important;
    background:rgba(219, 74, 132) !important;
    margin: 0;
}

li {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
}

.rounded-circle {
    object-fit: cover;
}

i {
    color: white !important;
}

@media (max-width: 991.98px) {
    .navbar-collapse {
        background-color: rgb(205, 89, 213);
        padding: 10px;
        border-radius: 5px;
    }

    .navbar-nav {
        flex-direction: column;
    }

    .nav-item {
        width: 100%;
        text-align: start !important;
    }
}
</style>