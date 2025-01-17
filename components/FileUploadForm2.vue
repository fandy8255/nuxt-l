<template>
    <div>
        <!-- Button to trigger the modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            Upload File
        </button>

        <!-- Bootstrap Modal -->
        <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="uploadFileModalLabel">Upload File</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Form -->
                        <form @submit.prevent="uploadFile">
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Select File</label>
                                <input type="file" class="form-control" id="fileInput"
                                    @change="(e) => { console.log(e.target.files); file.value = e.target.files[0]; }"
                                    required />
                            </div>
                            <button type="submit" class="btn btn-success">Submit</button>
                        </form>
                        <!-- Upload Status -->
                        <p class="mt-3">{{ uploadStatus }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const runtimeConfig = useRuntimeConfig(/*event*/) //use for prod
const supabase = useSupabaseClient()
const { data: { user } } = await supabase.auth.getUser()
// Reactive state variables
const file = ref({});
const uploadStatus = ref('');
const modalId = 'uploadFileModal'; // ID for the Bootstrap modal

// Function to upload file
const uploadFile = async () => {
    if (!file.value) {
        uploadStatus.value = 'Please select a file.';
        return;
    }

    const formData = new FormData();
    formData.append('file', file.value.value);

    //console.log(file.value.value)

    
    try {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/uploadFile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                'X-User-ID': `${user.id}`
            },
            body: formData,
        });

        if (response.ok) {
            uploadStatus.value = 'File uploaded successfully!';
        } else {
            const errorText = await response.text();
            uploadStatus.value = `Failed to upload file: ${response.status} - ${errorText}`;
        }
    } catch (error) {
        uploadStatus.value = `Error uploading file: ${error.message}`;
        console.log(error)
    }
};

// Reset the form and upload status when the modal closes
const resetForm = () => {
    file.value = null;
    uploadStatus.value = '';
};
</script>


<style scoped>
/* Optional custom styling */
</style>