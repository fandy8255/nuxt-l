<template>
    <div>
        <!-- Delete Button -->
        <button type="button" class="btn btn-sm btn-danger text-light" data-bs-toggle="modal"
            :data-bs-target="`#${modalId}_${productId}`">
            Eliminar
        </button>

        <!-- Delete Modal -->
        <div class="modal fade" :id="`${modalId}_${productId}`" tabindex="-1" aria-labelledby="deleteProductModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteProductModalLabel">
                            Confirmación 
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Estas segura de eliminar este producto y todas las fotos asociadas?
                    </div>
                    <div class="modal-footer">
                        <form @submit.prevent="deleteProduct">
                        
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const runtimeConfig = useRuntimeConfig();
const modalId = 'deleteProductModal';
const userStore = useUserStore();

// Set the product ID dynamically
//const productId = ref(123); // Example product ID, replace dynamically when required

const { productId } = defineProps(['productId'])
const emit = defineEmits(['updateProductsStore'])

//console.log('toktok', userStore.user_tok)

const obj = {
    productId: productId,
    user_tok: userStore.user_tok
}

// Function to delete the product by ID
const deleteProduct = async () => {

    console.log('obj', obj)
    console.log(productId)

    
    try {
        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/deleteProduct`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                },
                body: JSON.stringify(obj)
            }
        );

        if (response.ok) {
            console.log('Product deleted successfully', await response.json());
            console.log('deleted product with id', productId)
            const modal = bootstrap.Modal.getInstance(
                document.getElementById(`${modalId}_${productId}`)
            );
            //emit('deleteProductFromStore')
            userStore.deleteProduct(productId)
            emit('updateProductsStore')
            modal.hide(); // Close the modal after deletion

        } else {
            console.error(
                `Failed to delete product: ${response.status} - ${await response.text()}`
            );
        }
    } catch (error) {
        console.error('Error while deleting product:', error.message);
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>