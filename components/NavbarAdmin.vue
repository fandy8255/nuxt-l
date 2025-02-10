<template>
    <nav v-if="isHydrated && !loading" class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex">
                <NuxtLink to="/ad" class="navbar-brand">
                    <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
                </NuxtLink>
                <h4 class="text-light lead my-auto">Panty Dashboard</h4>
            </div>

            <!-- Navbar Toggler Button -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2 me-2" v-if="session && is_admin">
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link text-decoration-none">Products</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/usuarios" class="nav-link text-decoration-none">Usuarios</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/mensajes" class="nav-link text-decoration-none">
                            <i class="fa-regular fa-envelope fa-xl me-2"></i>
                            <!-- Replace with actual message count if needed -->
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
                                <NuxtLink to="/perfil" class="dropdown-item">Cuenta</NuxtLink>
                            </li>
                            <li>
                                <button @click="signingOut" class="dropdown-item">Sign Out</button>
                            </li>
                        </ul>
                    </li>
                </ul>

            </div>
        </div>
    </nav>
</template>


<script setup>
import { ref, onMounted } from 'vue';

const router = useRouter();
const isHydrated = ref(false);
const session = useSupabaseSession();
const is_admin = ref(false);
const loading = ref(true);
const supabase = useSupabaseClient();
const navbarStore = useNavbarStore();

onMounted(async () => {
    isHydrated.value = true;
    const adminStatus=navbarStore.isAd()
    is_admin.value = adminStatus; 
    loading.value = false; 
});

// Sign out function
async function signingOut() {
    console.log('Signing out...');
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign-out error:', error);
            return;
        }

        console.log('Sign-out successful. Redirecting to login...');
        router.push('/login'); // Ensure the redirect happens after sign-out
        
    } catch (err) {
        console.error('Error during sign-out:', err);
    }
}
</script>


<style scoped>
a:hover,
button:hover {
    color: rgb(13, 0, 255);
}

.router-link-active {
    /*color: rgb(13, 0, 255)*/
}

.nav-link {
    font-weight: 600;
    font-style: normal;
    color: white !important;
}

nav {
    position: sticky !important;
    background: rgb(205, 89, 213) !important;
    margin: 0;
}

li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.rounded-circle {
    object-fit: cover;
}

i {
    color: white !important;
}
</style>