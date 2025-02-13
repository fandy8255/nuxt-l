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

const modalId = 'deleteProductModal';
const userStore = useUserStore();

const { productId } = defineProps(['productId'])
const emit = defineEmits(['updateProductsStore'])

const obj = {
    productId: productId,
    user_tok: userStore.user_tok
}

const deleteProduct = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/deleteProduct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                },
                body: JSON.stringify(obj)
            }
        );

        if (response.ok) {
           
            const modal = bootstrap.Modal.getInstance(
                document.getElementById(`${modalId}_${productId}`)
            );

            userStore.deleteProduct(productId)
            emit('updateProductsStore')
            modal.hide(); 

        } else {
            
        }
    } catch (error) {
        
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>