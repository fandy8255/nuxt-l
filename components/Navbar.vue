<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const isHydrated = ref(false);

onMounted(() => {
   /* isHydrated.value = true; */// Mark the store as hydrated when mounted
   console.log('logged in?', userStore.logged_in)
});


onUpdated(()=>{
   
})

async function signOut() {
    const { error } = await useSupabaseClient().auth.signOut();
    if (error) console.error('Sign-out error:', error);
    userStore.signOut({
        username: '',
        email: '',
        id:'',
        age: null,
        user_type: '',
        profile_description: '',
        profile_picture: '',
        ubicacion: '',
        logged_in: false,
        user_tok:'',
        user_profile:''
    });
    router.push('/');
}
</script>

<template>
    <nav class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex" v-if="userStore.logged_in">
                <NuxtLink to="/dashboard" class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto">Colombia Panty</h4>
            </div>
            <div v-else class="d-flex">
                <NuxtLink to="/" class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto">Colombia Panty</h4>
            </div>

            <!-- Navbar Toggler Button -->
            <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2" v-if="userStore.logged_in">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none">Tienda</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none">Usuarios</NuxtLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a 
                            class="nav-link dropdown-toggle" 
                            href="#" 
                            id="navbarDropdown" 
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">
                            {{ userStore.username }}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <NuxtLink to="/perfil" class="dropdown-item">Cuenta</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink :to="userStore.user_profile" class="dropdown-item">Perfil</NuxtLink>
                            </li>
                            <li>
                                <button @click="signOut" class="dropdown-item">Sign Out</button>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto gap-2" v-else>
                    <li>
                        <NuxtLink to="/contacto" class="nav-link text-decoration-none">Contacto</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/sobre-nosotros" class="nav-link text-decoration-none">Sobre Nosotros</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/blog" class="nav-link text-decoration-none">Blog</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/login" class="nav-link text-decoration-none">Login</NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style>
a:hover {
    color: white !important;
}

.router-link-active {
    color: rgb(13, 0, 255)
}

.nav-link {
    /*font-family: "Fira Sans", sans-serif;*/
    font-weight: 900;
    font-style: normal;
    color: white !important;
}

nav {
    position: sticky !important;
    background: rgb(205, 89, 213) !important;
    margin: 0;
}
</style>