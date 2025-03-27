<template>
    <nav v-if="isHydrated" class="navbar navbar-expand-lg navbar-dark w-100 position-fixed">
        <!-- Backdrop for blur effect -->
        <div class="navbar-backdrop"></div>

        <div class="container-fluid p-md-1 p-0 ">
            <!-- Logo and Brand Name -->
            <div class="d-flex align-items-center ms-2">
                <div v-if="isAd">
                    <NuxtLink :to="'/ad'" class="navbar-brand">
                        <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                    </NuxtLink>
                </div>
                <div v-else>
                    <NuxtLink v-if="userStore.logged_in" :to="'/feed'" class="navbar-brand">
                        <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                    </NuxtLink>
                    <NuxtLink v-else :to="'/'" class="navbar-brand">
                        <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                    </NuxtLink>
                </div>
                <h4 class="text-light lead my-auto ms-2 fw-bolder">Latin Panty</h4>

            </div>

            <!-- Navbar Toggler Button -->
            <button class="navbar-toggler me-md-0 me-2" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar Links -->
            <div class="collapse navbar-collapse" id="navbarNav" ref="navbarCollapse">
                <ul class="navbar-nav ms-auto gap-2 me-2" v-if="isAd">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Products
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none" @click="closeNavbar">Usuarios
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none" @click="closeNavbar">
                            <i class="fa-regular fa-envelope fa-xl me-2"></i>
                        </NuxtLink>
                    </li>
                    <li class="nav-item dropdown">
                        <div class="d-flex nav-link dropdown-toggle" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="d-flex flex-column justify-content-center align-items-center text-light">
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
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Tienda
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none" @click="closeNavbar">Usuarios
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none" @click="closeNavbar">
                            <i class="fa-regular fa-envelope fa-xl me-2 text-light"></i>{{ userStore.message_count }}
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/dashboard" class="nav-link text-decoration-none" @click="closeNavbar">Stats
                        </NuxtLink>
                    </li>
                    <li class="nav-item dropdown">
                        <div class="d-flex nav-link dropdown-toggle" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <NuxtImg provider="bunny" :src="userStore.profile_picture" class="rounded-circle me-2"
                                width="40px" height="40px" alt="User Image" :quality="10" loading="lazy"
                                placeholder="/assets/images/panty-icon.jpg" />
                            <div class="d-flex flex-column justify-content-center align-items-center text-light">
                                {{ userStore.username }}
                            </div>
                        </div>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <NuxtLink to="/perfil" class="dropdown-item" @click="closeNavbar">Cuenta</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink :to="userStore.user_profile" class="dropdown-item" @click="closeNavbar">Perfil
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/compras" class="dropdown-item" @click="closeNavbar">Mis Compras
                                </NuxtLink>
                            </li>
                            <li>
                                <button @click="signOut" class="dropdown-item">Salir</button>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto gap-2" v-else>
                    <li>
                        <NuxtLink to="/landing/vendedoras" class="nav-link text-decoration-none" @click="closeNavbar">
                            Vendedoras</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/landing/tienda" class="nav-link text-decoration-none" @click="closeNavbar">Tienda
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/revista" class="nav-link text-decoration-none" @click="closeNavbar">Revista
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/contacto" class="nav-link text-decoration-none" @click="closeNavbar">Contacto
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/login" class="nav-link text-decoration-none" @click="closeNavbar">Login
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
/*import { useRouter } from 'vue-router';*/

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
        const collapseInstance = new bootstrap.Collapse(navbarCollapse.value, {
            toggle: false, // Ensure it only hides
        });
        collapseInstance.hide(); // Hide the navbar
    }
    // console.log('closed navbar')
}

async function signOut() {
    const { error } = await useSupabaseClient().auth.signOut();
    if (error) {
        console.error(error);
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
        orders: [],
        message_count: 0
    });

    await navbarStore.isAd();

    router.push('/');
}
</script>

<style scoped>
/* Frosted glass navbar */
nav {
    position: sticky !important;
    height: 76px;
    margin: 0;
    background: transparent !important;
    z-index: 1030;
    /* Higher than most content */
    transition: all 0.3s ease;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Frosted glass effect */
.navbar-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(219, 74, 132, 0.88);
    /* Brand color with transparency */
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    z-index: -1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Logo enhancements */
.logo-img {
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: scale(1.05);
}

.brand-text {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

/* Nav items */
.nav-link {
    font-weight: 600;
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
}

/*
.nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
}*/

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 60%;
}

/* Dropdown enhancements */
.dropdown-menu {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: none;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
}

.dropdown-item {
    padding: 0.5rem 1.25rem;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background: rgba(219, 74, 132, 0.1);
    color: #db4a84 !important;
}

/* Mobile menu enhancements */
@media (max-width: 991.98px) {
    .navbar-collapse {
        background: rgba(219, 74, 132, 0.95) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 1rem;
        border-radius: 12px;
        margin-top: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .navbar-nav {
        gap: 0.5rem;
    }

    .nav-link {
        padding: 0.75rem;
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }
}

/* Desktop enhancements */
@media (min-width: 992px) {
    nav {
        height: 80px;
    }

    .navbar-nav {
        gap: 0.5rem;
    }

    .nav-link {
        margin: 0 0.25rem;
    }
}

@supports not (backdrop-filter: blur(12px)) {
    .navbar-backdrop {
        background: rgba(219, 74, 132, 0.95) !important;
        /* More opaque fallback */
    }

    .dropdown-menu {
        background: rgba(255, 255, 255, 0.98) !important;
        /* Solid white fallback */
    }

    .navbar-collapse {
        background: rgba(219, 74, 132, 0.98) !important;
        /* Solid pink fallback */
    }
}
</style>