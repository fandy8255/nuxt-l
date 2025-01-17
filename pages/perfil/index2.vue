<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">User Dashboard</h1>
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div v-if="userData">
                <div class="row align-items-center g-4">
                    <!-- Profile Image -->
                    <div class="col-md-4 text-center">
                        <img :src="userData.profileImage || '/assets/images/hero-banner.jpg'" alt="Profile Image"
                            class="img-fluid shadow-sm rounded"
                            style="width: 100%; height: auto; max-height: 400px; object-fit: cover;" />
                    </div>
                    <!-- User Data -->
                    <div class="col-md-8">
                        <div class="card shadow-sm border-0">
                            <div class="card-body">
                                <h2 class="card-title lead">{{ userData.username ?? 'Nuevo Usuario' }}</h2>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <strong>Correo:</strong> {{ userData.email }}
                                    </li>
                                    <li class="list-group-item">
                                        <strong>Edad:</strong> {{ userData.age }}
                                    </li>
                                    <li class="list-group-item">
                                        <strong>Tipo de Usuario:</strong> {{ userData.user_type }}
                                    </li>
                                    <li class="list-group-item">
                                        <strong>Descripcion:</strong>
                                        <pre>
                                            {{ userData.profile_description }}
                                        </pre>
                                    </li>
                                    <li class="list-group-item">
                                        <strong>Ubicacion:</strong> Colombia
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-muted">
                No user data found.
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
    const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
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
onMounted(async() => {
   await getUserData(user.id).then(res=>{
        userData.value=res.data
        loading.value=false
        console.log('res', userData)
    })
});
</script>

<style scoped>
/* Add optional custom styles for the dashboard */
.card {
    border-radius: 12px;
}

.list-group-item {
    background-color: #f9f9f9;
    border: none;
}

.text-primary {
    font-weight: bold;
}

.shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>