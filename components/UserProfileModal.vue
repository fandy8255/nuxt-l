<template>
    <div>
        <!-- Botón para abrir el modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
            Editar Perfil
        </button>

        <!-- Modal -->
        <div class="modal fade" id="editProfileModal" aria-labelledby="editProfileModalLabel">
            <div class="modal-dialog">
                <div class="modal-content" style="z-index: 2000 !important">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editProfileModalLabel">Actualizar Perfil</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="updateProfile">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="description" class="form-label">Descripción</label>
                                <textarea id="description" v-model="form.description" class="form-control"
                                    rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="ubicacion" class="form-label">Ubicación</label>
                                <select v-model="form.ubicacion" class="form-select" id="ubicacion" required>
                                    <option value="Colombia">Colombia</option>
                                    <option value="Peru">Peru</option>
                                    <option value="España">España</option>
                                    <option value="Ecuador">Ecuador</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="profilePicture" class="form-label">Foto de Perfil</label>
                                <input type="file" id="profilePicture" @change="handleFileUpload"
                                    class="form-control" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Props
defineProps({
    user: Object,
});

// Reactive form data
const form = ref({
    description: "",
    ubicacion: "",
    profilePicture: null,
});


// File upload handler
const handleFileUpload = (event) => {
    form.value.profilePicture = event.target.files[0];
};

const userStore = useUserStore();

// Update profile method
const updateProfile = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch("https://lingerie.fandy8255.workers.dev/api/user/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                "X-User-ID": user.id,
            },
            body: JSON.stringify({
                description: form.value.description,
                ubicacion: form.value.ubicacion,
                profilePicture: "profile_pic_url", // Actualizar lógica según backend
            }),
        });

        if (response.ok) {
            alert("Perfil actualizado con éxito");
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Error al actualizar el perfil");
        }
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>