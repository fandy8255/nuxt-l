<template>
    <nav class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex">
                <NuxtLink to="/" class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto">Colombain Panties</h4>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2">
                    <li class="nav-item">
                        <NuxtLink to="/contacto" class="nav-link text-decoration-none">Contacto</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/sobre-nosotros" class="nav-link text-decoration-none">Sobre Nosotros</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/blog" class="nav-link text-decoration-none">Blog</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none">Tienda</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="user">
                        <div class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false" style="color:blue !important;">
                                {{ user.email || user.username }}
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li class="text-start">
                                    <NuxtLink to="/dashboard" class="text-decoration-none dropdown-item">Perfil
                                    </NuxtLink>
                                </li>
                                <li class="text-start">
                                    <button @click="signOut" class="dropdown-item">Sign Out</button>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item" v-else>
                        <NuxtLink to="/login" class="nav-link text-decoration-none">Login</NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()
const user = ref(null)

onMounted(async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) console.error(error)
    user.value = data?.user || null

    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null
    })
})

async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Sign-out error:', error)
    user.value = null
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