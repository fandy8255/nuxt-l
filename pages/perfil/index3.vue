<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Perfil de Usuario</h1>
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        <div v-else>
            <div v-if="userData" class="card shadow-lg border-0">
                <div class="card-body">
                    <!-- Section Header -->
                    <h2 class="mb-4">Detalles Personales</h2>
                    <div class="row g-5">
                        <!-- Profile Image -->
                        <div class="col-md-4 text-center">
                            <!--
                            <img :src="userData.profileImage || '/assets/images/hero-banner.jpg'" alt="Imagen de Perfil"
                                class="img-fluid rounded-circle shadow-sm border"
                                style="width: 150px; height: 150px; object-fit: cover;" />-->

                                <img :src="userData.profileImage || '/assets/images/hero-banner.jpg'" alt="Imagen de Perfil"
                                class="img-fluid shadow-sm border"
                                style="width: 100%; height: auto; object-fit: cover;" />
                        </div>
                        <!-- User Details -->
                        <div class="col-md-8">
                            <form>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Nombre</label>
                                        <input type="text" class="form-control" v-model="userData.username" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Correo Electrónico</label>
                                        <input type="email" class="form-control" v-model="userData.email" disabled />
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Edad</label>
                                        <input type="number" class="form-control" v-model="userData.age" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Tipo de Usuario</label>
                                        <input type="text" class="form-control" v-model="userData.user_type" disabled />
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" v-model="userData.profile_description" rows="4"
                                        disabled></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Ubicación</label>
                                    <input type="text" class="form-control" value="Colombia" disabled />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-muted mt-4">
                No se encontraron datos del usuario.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
//import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const { data: { user } } = await supabase.auth.getUser() //get user
const runtimeConfig = useRuntimeConfig(/*event*/)

// Reactive variables
const userData = ref(null);
const loading = ref(true);

// Fetch authenticated user data
const getUserData = async (id) => {
    const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            'X-User-ID': `${id}`
        }
    });

    const result = await response.json()
    return result
}


// Lifecycle hook
onMounted(async () => {
    await getUserData(user.id).then(res => {
        userData.value = res.data
        loading.value = false
        console.log('res', userData)
    })
});

</script>

<style scoped>
.card {
    border-radius: 15px;
    background-color: #fff;
}

.form-label {
    font-weight: bold;
}

img {
    border: 3px solid #f1f1f1;
}

h1,
h2 {
    font-family: "Roboto", sans-serif;
}

textarea,
input {
    background-color: #f9f9f9;
}
</style>