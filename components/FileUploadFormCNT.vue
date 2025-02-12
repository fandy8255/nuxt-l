<template>
    <div>
        <button type="button" class="btn-file btn" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            Crear Producto
        </button>

        <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content text-start">
                    <div class="modal-header">
                        <h5 class="modal-title" id="uploadFileModalLabel">Sube Tu Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                    </div>
                    <div v-if="!loading" class="modal-body">
                        <form @submit.prevent="uploadFiles">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <select v-model="cntUser" @change="test" class="form-select" id="username" required >
                                    <option v-for="(user, index) in users" :key="index" :value="user"> {{ user.username }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="productName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="productName" v-model="productName"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="productPrice" class="form-label">Precio</label>
                                <input type="number" class="form-control" id="productPrice" v-model="productPrice"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="productDescription" class="form-label">Descripción</label>
                                <textarea class="form-control" id="productDescription" v-model="productDescription"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="productCategory" class="form-label">Categoría</label>
                                <select v-model="productCategory" class="form-select" id="productCategory" required>
                                    <option value="contenido">Contenido</option>
                                    <option value="panties">Panties</option>
                                    <option value="tangas">Tangas</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Selecciona Fotos</label>
                                <input type="file" class="form-control" id="fileInput" @change="handleFilesChange"
                                    multiple required />
                            </div>
                            <button type="submit" class="btn btn-success">Crear</button>
                        </form>
                        <p class="mt-3">{{ uploadStatus }}</p>
                    </div>
                    <div v-else>
                        <div class="row w-100 d-flex justify-content-center align-items-center my-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const modalId = 'uploadFileModal';
const files = ref([]); // Array to hold multiple files
const uploadStatus = ref('');
const productName = ref('');
const productPrice = ref('');
const productDescription = ref('');
const productCategory = ref('');
const cntUser = ref('');
const loading=ref(true)
const users = ref([]);
const navbarStore = useNavbarStore();
//const emit = defineEmits(['updateProductsStore'])


function test(e){
    console.log('change', e.target.value)
    console.log(cntUser.value)
}

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
        const timestamp = Date.now().toString();
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/uploadProduct', {
            method: 'POST',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(cntUser.value),
                'X-User-s': JSON.stringify(cntUser.value)
            },
            body: formData,
        });

        if (response.ok) {
            uploadStatus.value = 'Files and product uploaded successfully!';
            const result = await response.json()

            document.querySelector('button.btn-close').click();
            /*
            emit('success', {
                success: true,
                text: 'El producto ha sido subido exitosamente.',
            });*/


        } else {
            uploadStatus.value = `Failed: ${response.status} - ${await response.text()}`;
        }
    } catch (error) {
        console.error('error', error)
        /*
        emit('success', {
            success: false,
            text: 'El producto no pudo ser subido',
        });*/
        uploadStatus.value = `Error: ${error.message}`;
    }
};

const fetchUsers = async () => {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const navbarStore = useNavbarStore();
    const signature = await navbarStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/cnt-users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    });

    const parsed = await response.json();
    console.log('cnt users parsed gg', parsed.data.results);
    users.value = parsed.data.results;
};

onMounted(async () => {
    await fetchUsers().finally(() => (loading.value = false));
});

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

.btn-file {
    background: rgb(242, 97, 0);
    color: white !important;
}

.btn-file:hover {
    background: green;
}
</style>