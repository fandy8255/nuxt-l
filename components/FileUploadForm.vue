<template>
    <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            Upload Files
        </button>

        <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="uploadFileModalLabel">Upload Files</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="uploadFiles">
                            <div class="mb-3">
                                <label for="productName" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="productName" v-model="productName"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="productPrice" class="form-label">Product Price</label>
                                <input type="number" class="form-control" id="productPrice" v-model="productPrice"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="productDescription" class="form-label">Product Description</label>
                                <textarea class="form-control" id="productDescription" v-model="productDescription"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="productCategory" class="form-label">Product Category</label>
                                <select v-model="productCategory" class="form-select" id="productCategory" required>
                                    <option value="contenido">Contenido</option>
                                    <option value="panties">Panties</option>
                                    <option value="tangas">Tangas</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Select Files</label>
                                <input type="file" class="form-control" id="fileInput" @change="handleFilesChange"
                                    multiple required />
                            </div>
                            <button type="submit" class="btn btn-success">Submit</button>
                        </form>
                        <p class="mt-3">{{ uploadStatus }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const runtimeConfig = useRuntimeConfig();

const userStore = useUserStore();
const username = userStore.username;
const email = userStore.email;
const user_type = userStore.user_type;
const user = userStore.user_tok;

const obj = {
    email: email,
    user_type: user_type
};

const modalId = 'uploadFileModal';
const files = ref([]); // Array to hold multiple files
const uploadStatus = ref('');
const productName = ref('');
const productPrice = ref('');
const productDescription = ref('');
const productCategory = ref('');

const handleFilesChange = (event) => {
    
    files.value = Array.from(event.target.files); // Store selected files in an array
    console.log('changing files', files.value)
};

const uploadFiles = async () => {
    if (!files.value.length || !productName.value || !productPrice.value || !productDescription.value || !productCategory.value) {
        uploadStatus.value = 'All fields are required.';
        return;
    }
    
    console.log('final files', files.value)

    const formData = new FormData();
    files.value.forEach((file, index) => {
        formData.append('file', file); // Append each file with a unique key
    });
    formData.append('product_name', productName.value);
    formData.append('username', username);
    formData.append('product_price', productPrice.value);
    formData.append('product_description', productDescription.value);
    formData.append('product_category', productCategory.value);

    try {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/uploadProduct', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                'X-User': JSON.stringify(user),
                'X-User-s': JSON.stringify(obj)
            },
            body: formData,
        });

        if (response.ok) {
            uploadStatus.value = 'Files and product uploaded successfully!';
        } else {
            uploadStatus.value = `Failed: ${response.status} - ${await response.text()}`;
        }
    } catch (error) {
        uploadStatus.value = `Error: ${error.message}`;
    }
};

const resetForm = () => {
    files.value = [];
    productName.value = '';
    productPrice.value = '';
    productDescription.value = '';
    productCategory.value = '';
    uploadStatus.value = '';
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>