<script setup>
import { ref, onMounted, onUpdated } from 'vue';
/*import { useUserStore } from '~/stores/user';*/
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const isHydrated = ref(false);

onMounted(() => {
    isHydrated.value = true;
    console.log('logged in?', userStore.logged_in)
});


async function signOut() {
    const { error } = await useSupabaseClient().auth.signOut();
    if (error) console.error('Sign-out error:', error);
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
        user_profile: ''
    });
    router.push('/');
}
</script>

<template>
    <nav v-if="isHydrated" class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex" v-if="userStore.logged_in">
                <NuxtLink to="/feed" class="navbar-brand">
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
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2 me-2" v-if="userStore.logged_in">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none">Tienda</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none">Usuarios</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none"><i class="fa-regular fa-envelope fa-xl"></i></NuxtLink>
                    </li>
                    <li v-if="userStore.user_type==='seller'" class="nav-item">
                        <NuxtLink to="/dashboard" class="nav-link text-decoration-none">Stats</NuxtLink>
                    </li>
                    
                    <!--<button @click="signOut" class="dropdown-item">Sign Out</button>-->
                    <li class="nav-item dropdown">
                        <div class="d-flex nav-link dropdown-toggle" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <NuxtImg provider="bunny" :src="userStore.profile_picture" class="rounded-circle me-2"
                                width="40px" height="40px" alt="User Image" :quality="10" loading="lazy"
                                placeholder="/assets/images/panty-icon.jpg" />
                            <div style="display: flex !important; flex-direction: column; justify-content: center; align-items: center;padding: 0; color: aliceblue !important;" >
                                {{ userStore.username }}
                            </div>
                        </div>


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
                        <NuxtLink to="/contacto" class="nav-link text-decoration-none">Contacto </NuxtLink>
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

<style scoped>
a:hover, button:hover {
    /*color: white !important;*/
    color: rgb(13, 0, 255)
}

.router-link-active {
    /*color: rgb(13, 0, 255)*/
}

.nav-link {
    /*font-family: "Fira Sans", sans-serif;*/
    font-weight: 600;
    font-style: normal;
    color: white !important;
}

nav {
    position: sticky !important;
    background: rgb(205, 89, 213) !important;
    margin: 0;
}

li{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.rounded-circle {
    object-fit: cover;
}

i{
    color: white !important;
}
</style>