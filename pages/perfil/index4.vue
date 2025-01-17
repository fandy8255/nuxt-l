<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Información de Cuenta</h1>
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        <div v-else>
            <MessageModal :message="message" @clear="clearMessage" />

            <div v-if="userData" class="card shadow-lg border-0 p-3">
                <div class="card-body">
                    <!-- Section Header -->
                    <h2 class="mb-4">Detalles {{userData.username}} </h2>
                    <div class="row g-5">
                        <!-- Profile Image -->
                        <div class="col-md-4 text-center">

                            <NuxtImg provider="bunny" :src="userData.profile_picture" height="auto" width="300px"
                                :quality="50" />

                        </div>
                        <!-- User Details -->
                        <div class="col-md-8">
                            <form @submit.prevent="updateProfile">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Nombre de Usuario</label>
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
                                    <textarea class="form-control" v-model="userData.profile_description"
                                        rows="4"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="ubicacion" class="form-label">Ubicación</label>
                                    <select v-model="userData.ubicacion" class="form-select" id="ubicacion">
                                        <option value="Colombia">Colombia</option>
                                        <option value="Peru">Peru</option>
                                        <option value="España">España</option>
                                        <option value="Ecuador">Ecuador</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="fileInput" class="form-label">Select File</label>
                                    <input type="file" class="form-control" id="fileInput" @change="handleFileChange"
                                        required />
                                </div>
                                <button type="submit" class="btn btn-primary"> Actualizar </button>
                            </form>
                        </div>
                    </div>
                    <!-- Insertar Modal -->
                    <!-- <UserProfileModal :user="userData" />-->
                </div>
            </div>
            <div v-else class="text-center text-muted mt-4">
                No se encontraron datos del usuario.
            </div>
        </div>
        <br>
        <br>
        <br>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
//import UserProfileModal from "./UserProfileModal.vue";

const supabase = useSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
const runtimeConfig = useRuntimeConfig();

const userData = ref(null);
const loading = ref(true);
const file = ref(null);
const message = ref('');

const clearMessage = () => {
    message.value = '';
};

const getUserData = async (id) => {
    const response = await fetch("https://lingerie.fandy8255.workers.dev/api/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
            "X-User": JSON.stringify(user),
        },
    });

    const result = await response.json();
    return result;
};

// Update profile method
const handleFileChange = (event) => {
    file.value = event.target.files[0];
};

const updateProfile = async () => {
    try {
        const formData = new FormData();
        formData.append("profile_description", userData.value.profile_description);
        formData.append("ubicacion", userData.value.ubicacion);

        if (file && file.value) {
            formData.append('file', file.value);
        }

        const response = await fetch("https://lingerie.fandy8255.workers.dev/api/user/update", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                "X-User": JSON.stringify(user),
            },
            body: formData,
        });

        if (response.ok) {
            message.value = { success: 'Actualizado con éxito.' };
            let results= await response.json()
            let data=JSON.parse(results.data)
            userData.value.profile_picture=data.profile_picture
            userData.value.profile_description=data.profile_description
            userData.value.ubicacion=data.ubicacion
         
        } else {
            message.value = { failure: 'Error al actualizar el perfil' };
            //const errorData = await response.json();
            //alert(errorData.error || "Error al actualizar el perfil");
        }
    } catch (error) {
        message.value = { failure: `Error al actualizar el perfil : ${error} ` };
        //console.error("Error al actualizar el perfil:", error);
    }
};

onMounted(async () => {
    await getUserData(user.id).then((res) => {
        userData.value = res.data;
        loading.value = false;
    });
});
</script>