<template>
    <div>
        <!-- Hide/Unhide Button -->
        <button type="button" class="btn btn-sm text-light" :class="isVisible ? 'btn-danger' : 'btn-success'" data-bs-toggle="modal"
            :data-bs-target="`#${modalId}_${productId}`">
            {{ isVisible ? 'Hide' : 'Unhide' }}
        </button>

        <!-- Hide/Unhide Modal -->
        <div class="modal fade" :id="`${modalId}_${productId}`" tabindex="-1" aria-labelledby="hideProductModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="hideProductModalLabel">
                            {{ isVisible ? 'Hide Product' : 'Unhide Product' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to {{ isVisible ? 'hide' : 'unhide' }} this product?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn" :class="isVisible ? 'btn-danger' : 'btn-success'" @click="toggleProductVisibility">
                            {{ isVisible ? 'Hide' : 'Unhide' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
//import { useNavbarStore } from '~/stores/navbar'; // Adjust the import based on your project structure

const modalId = 'hideProductModal';
const navbarStore = useNavbarStore();

const { productId, isVisible } = defineProps(['productId', 'isVisible']);
//const emit = defineEmits(['updateProductsStore']);

const toggleProductVisibility = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const user = await navbarStore.getUser();

        const response = await fetch(
            'https://lingerie.fandy8255.workers.dev/api/ad/toggle-product-visibility',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user), // Include admin user data
                },
                body: JSON.stringify({
                    productId: productId,
                }),
            }
        );

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById(`${modalId}_${productId}`)
            );
            modal.hide();

            //emit('updateProductsStore'); // Emit event to update the products list in the parent component
        } else {
            console.error('Failed to toggle product visibility:', await response.text());
        }
    } catch (error) {
        console.error('Error while toggling product visibility:', error.message);
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>