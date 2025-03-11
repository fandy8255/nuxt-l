<template>
    <div>
        <button type="button" class="btn btn-primary text-light" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
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
                    <div class="modal-body">
                        <form @submit.prevent="uploadFiles">
                            <div class="mb-3">
                                <label for="productName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="productName" v-model="productName"
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
                                    <option value="tangas">Otro</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="productPrice" class="form-label">Precio</label>
                                <input type="number" class="form-control" id="productPrice" v-model="productPrice"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="productCurrency" class="form-label">Moneda</label>
                                <select v-model="productCurrency" class="form-select" id="productCurrency" required>
                                    <option value="ars">Peso Argentino</option>
                                    <option value="clp">Peso Chileno</option>
                                    <option value="cop">Peso Colombiano</option>
                                    <option value="mxn">Peso Mexicano</option>
                                    <option value="usd">Dólar Estadounidense</option>
                                    <option value="uyu">Peso Uruguayo</option>
                                    <option value="pen">Sol Peruano</option>
                                    <option value="pyg">Guaraní Paraguayo</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="productStock" class="form-label">Cantidad/Stock</label>
                                <input type="number" class="form-control" id="productStock" v-model="productStock"
                                    required min="1" max="1000" step="1" />
                            </div>
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Selecciona Fotos</label>
                                <input type="file" class="form-control" id="fileInput" @change="handleFilesChange"
                                    multiple required />
                            </div>
                            <button type="submit" class="btn btn-primary text-light">Crear</button>
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
const files = ref([]);
const uploadStatus = ref('');
const productName = ref('');
const productPrice = ref('');
const productDescription = ref('');
const productCurrency = ref('');
const productStock = ref('');
const productCategory = ref('');

const emit = defineEmits(['updateProductsStore'])

const handleFilesChange = (event) => {
    files.value = Array.from(event.target.files);

};


const uploadFiles = async () => {
    if (!files.value.length || !productName.value || !productPrice.value || !productDescription.value || !productCategory.value || !productCurrency.value || !productStock.value) {
        uploadStatus.value = 'All fields are required.';
        return;
    }

    const formData = new FormData();
    files.value.forEach((file, index) => {
        formData.append('file', file);
    });
    formData.append('username', username);
    formData.append('product_name', productName.value);
    formData.append('product_description', productDescription.value);
    formData.append('product_category', productCategory.value);
    formData.append('product_price', productPrice.value);
    formData.append('product_currency', productCurrency.value);
    formData.append('product_stock', productStock.value);
    

    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/uploadProduct', {
            method: 'POST',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
                'X-User-s': JSON.stringify(obj)
            },
            body: formData,
        });

        if (response.ok) {
            uploadStatus.value = 'Files and product uploaded successfully!';
            const result = await response.json()
            userStore.addProduct(result.product)

            let feedItem = { ...result.product }
            feedItem.type = "product"
            userStore.addToFeed(feedItem)

            emit('updateProductsStore')
            document.querySelector('button.btn-close').click();
            emit('success', {
                success: true,
                text: 'El producto ha sido subido exitosamente.',
            });


        } else {
            uploadStatus.value = `Failed: ${response.status} - ${await response.text()}`;
        }
    } catch (error) {
        emit('success', {
            success: false,
            text: 'El producto no pudo ser subido',
        });
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

/*
.btn-file {
    background: rgb(242, 97, 0);
    color: white !important;
}

.btn-file:hover {
    background: green;
}*/

</style>