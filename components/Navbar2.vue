<template>
    <nav class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex">
                <NuxtLink to="/" class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto">
                    Colombian Panties
                </h4>

            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2">
                    <li class="nav-item">
                        <NuxtLink to="/contacto" class="nav-link  text-decoration-none">Contacto</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link  text-decoration-none fs-bold" to="/sobre-nosotros">Sobre Nosotros
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link  text-decoration-none" to="/blog">Blog</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link  text-decoration-none">Tienda</NuxtLink>
                    </li>
                    <div>

                    </div>
                    <li class="nav-item" v-if="userAuth.user">
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Home</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                        data-bs-toggle="dropdown" aria-expanded="false" style="color:blue !important;">
                                        {{ username }}
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li class="text-start">
                                            <NuxtLink to="/dashboard" class="text-decoration-none">Perfil</NuxtLink>
                                        </li>
                                        <li class="text-start"><button @click="signOut" class="dropdown-item"
                                                href="#">Sign Out</button></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                    </li>
                    <li class="nav-item" v-else>
                        <NuxtLink to="/login" class="nav-link  text-decoration-none">Login</NuxtLink>
                    </li>

                </ul>
            </div>
        </div>
    </nav>

</template>

<script setup>

import { onMounted, ref, onUpdated } from 'vue'

const router = useRouter()
const username = ref('')
import { useSupabaseClient } from '#imports'
const supabase = useSupabaseClient()

let localUser = localStorage.getItem('username');
const user = await supabase.auth.getUser()
let userAuth = user.data

onMounted(async () => {
    try {

        if (localUser && localUser !== null) {
            username.value = localUser.toString()
        } else {
            user = await supabase.auth.getUser()
            userAuth = user.data
            username.value = userAuth
            localStorage.setItem('username', userAuth);
            console.log('uauth', userAuth.user)
        }

    } catch (error) {
        console.log(error)
    }

});

async function signOut() {
    const { error } = await supabase.auth.signOut()
    localStorage.setItem('username', null);
    if (error) throw error;
    router.push('/')
}

</script>

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