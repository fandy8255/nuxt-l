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

            <div v-if="userStore.logged_in" class="card shadow-lg border-0 p-3">
                <div class="card-body">
                    <h2 class="mb-4">Detalles {{ userStore.username }} </h2>
                    <div class="row g-5">
                        <!-- Profile Image -->
                        <div class="col-md-4 text-center">
                            <div class="container border rounded">
                                <NuxtImg provider="bunny" :src="userStore.profile_picture" height="auto" width="300px"
                                :quality="50" placeholder="/assets/images/panty-icon.png"  />
                            </div>
                            
                        </div>
                        <!-- User Details -->
                        <div class="col-md-8">
                            <form @submit.prevent="updateProfile">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Nombre de Usuario</label>
                                        <input type="text" class="form-control" v-model="userStore.username" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Correo Electrónico</label>
                                        <input type="email" class="form-control" v-model="userStore.email" disabled />
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Edad</label>
                                        <input type="number" class="form-control" v-model="userStore.age" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Tipo de Usuario</label>
                                        <input type="text" class="form-control" v-model="userStore.user_type"
                                            disabled />
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" v-model="userStore.profile_description"
                                        rows="4"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="ubicacion" class="form-label">Ubicación</label>
                                    <select v-model="userStore.ubicacion" class="form-select" id="ubicacion">
                                        <option value="Colombia">Colombia</option>
                                        <option value="Peru">Peru</option>
                                        <option value="España">España</option>
                                        <option value="Ecuador">Ecuador</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="fileInput" class="form-label">Select File</label>
                                    <input type="file" class="form-control" id="fileInput" @change="handleFileChange" />
                                </div>
                                <button type="submit" class="btn btn-primary"> Actualizar </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-muted mt-4">
                No se encontraron datos del usuario.
            </div>
        </div>
        <br />
        <br />
        <br />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const userStore = useUserStore();
const file = ref(null);
const message = ref('');
const loading = ref(true);

useSeoMeta({
  title: `Perfil`,
  description: 'Perfil',
  robots: 'noindex', 
});

const clearMessage = () => {
    message.value = '';
};

const handleFileChange = (event) => {
    file.value = event.target.files[0];
};

const updateProfile = async () => {
    try {
        const formData = new FormData();
        formData.append('profile_description', userStore.profile_description);
        formData.append('ubicacion', userStore.ubicacion);

        if (file.value) {
            formData.append('file', file.value);
        }
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user/update', {
            method: 'POST',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(userStore.user_tok),
            },
            body: formData,
        });

        if (response.ok) {
            
            const result = await response.json();
            const updatedData = result.data

            userStore.updateUserProfile({
                profile_picture: updatedData.profile_picture ? updatedData.profile_picture : userStore.profile_picture ,
                profile_description: updatedData.profile_description ? updatedData.profile_description : userStore.profile_description ,
                ubicacion: updatedData.ubicacion ? updatedData.ubicacion : userStore.ubicacion,
            });

            message.value = { success: 'Actualizado con éxito.' };
            
        } else {
            message.value = { failure: 'Error al actualizar el perfil.' };
        }
    } catch (error) {
        const result = await response.json();
        message.value = { failure: `Error al actualizar el perfil: ${error}` };
    }
};

onMounted(() => {
    if (userStore.logged_in) {
        loading.value = false;
    } else {
        loading.value = false;
    }
});
</script>