<template>
    <div>
        <!-- Edit Button -->
        <button type="button" class="btn btn-sm btn-danger text-light" data-bs-toggle="modal"
            :data-bs-target="`#${modalId}_${user.id}`">
            Edit
        </button>

        <!-- Modal -->
        <div class="modal fade" :id="`${modalId}_${user.id}`" tabindex="-1" aria-labelledby="editProductModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h2 class="modal-title">Detalles de {{ user.username }}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <!-- Modal Body -->
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row g-4">
                                <!-- Profile Image -->
                                <div class="col-md-4 text-center">
                                    <div class="profile-image-container border rounded p-3">
                                        <NuxtImg provider="bunny" :src="user.profile_picture" height="auto"
                                            width="200px" :quality="50" placeholder="/assets/images/panty-icon.png" />
                                    </div>
                                </div>

                                <!-- User Details Form -->
                                <div class="col-md-8">
                                    <form @submit.prevent="updateProfile">
                                        <!-- Username and Email -->
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="form-label">Nombre de Usuario</label>
                                                <input type="text" class="form-control" v-model="obj.username"
                                                    disabled />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Correo Electrónico</label>
                                                <input type="email" class="form-control" v-model="obj.email" disabled />
                                            </div>
                                        </div>

                                        <!-- Age and User Type -->
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="form-label">Edad</label>
                                                <input type="number" class="form-control" v-model="obj.age" disabled />
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Tipo de Usuario</label>
                                                <input type="text" class="form-control" v-model="obj.user_type"
                                                    disabled />
                                            </div>
                                        </div>

                                        <!-- Profile Description -->
                                        <div class="mb-3">
                                            <label class="form-label">Descripción</label>
                                            <textarea class="form-control" v-model="obj.profile_description"
                                                rows="4"></textarea>
                                        </div>

                                        <!-- Location Dropdown -->
                                        <div class="mb-3">
                                            <label for="ubicacion" class="form-label">Ubicación</label>
                                            <select v-model="obj.ubicacion" class="form-select" id="ubicacion">
                                                <option value="Colombia">Colombia</option>
                                                <option value="Peru">Peru</option>
                                                <option value="España">España</option>
                                                <option value="Ecuador">Ecuador</option>
                                            </select>
                                        </div>

                                        <!-- File Upload -->
                                        <div class="mb-3">
                                            <label for="fileInput" class="form-label">Seleccionar Archivo</label>
                                            <input type="file" class="form-control" id="fileInput"
                                                @change="handleFileChange" />
                                        </div>

                                        <!-- Submit Button -->
                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-primary">Actualizar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const modalId = 'editModal';
const navbarStore = useNavbarStore();
const file = ref(null);
const message = ref('');
const loading = ref(true);
const { user } = defineProps(['user']);

const obj = reactive({
    id: user.id,
    email: user.email,
    username: user.username,
    ubicacion: user.ubicacion,
    profile_description: user.profile_description,
    user_type: user.user_type,
    age: user.age,
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
        formData.append('profile_description', obj.profile_description);
        formData.append('ubicacion', obj.ubicacion);

        if (file.value) {
            formData.append('file', file.value);
        }

        const timestamp = Date.now().toString();
        const signature = await navbarStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user/update', {
            method: 'POST',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            const updatedData = result.data;
            console.log('updated data', updatedData);
            message.value = { success: 'Actualizado con éxito.' };
        } else {
            console.log(await response.json());
            message.value = { failure: 'Error al actualizar el perfil.' };
        }
    } catch (error) {
        console.log('error', error);
        message.value = { failure: `Error al actualizar el perfil: ${error}` };
    }
};
</script>

<style scoped>
/* Custom Styles */
.modal-content {
    padding: 20px;
    border-radius: 10px;
}

.modal-header {
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.profile-image-container {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
}

.form-label {
    font-weight: 500;
    margin-bottom: 5px;
}

.form-control,
.form-select {
    border-radius: 5px;
    padding: 8px 12px;
    border: 1px solid #ced4da;
}

.form-control:disabled {
    background-color: #e9ecef;
}

textarea.form-control {
    resize: vertical;
}

.d-grid {
    margin-top: 20px;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 500;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>