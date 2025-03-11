<template>
    <div>
        <!-- Cancel Order Button -->
        <button class="btn btn-danger text-light" @click="openModal">
            Cancelar Orden
        </button>

        <!-- Bootstrap Modal -->
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cancelar Orden {{ orderId }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de cancelar la orden?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary text-light" @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-danger text-light" @click="submitCancelOrder" :disabled="isCanceling">
                            {{ isCanceling ? 'Cancelando...' : 'Sí, Cancelar Orden' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
/*
import { useUserStore } from '~/stores/userStore'; // Adjust the path as needed*/

const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['order-canceled', 'message']);

const userStore = useUserStore();
const isModalOpen = ref(false);
const isCanceling = ref(false);

// Open the modal
const openModal = () => {
    isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
    isModalOpen.value = false;
};

// Submit the cancel order request
const submitCancelOrder = async () => {
    isCanceling.value = true;

    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/cancel-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify({
                    id: userStore.id,
                    user_type: userStore.user_type
                }),
            },
            body: JSON.stringify({ orderId: props.orderId }),
        });

        /*
        if (!response.ok) throw new Error('Failed to cancel order');*/

        // Remove the canceled order from the user's orders array
        userStore.orders = userStore.orders.filter(order => order.order_id !== props.orderId);

        // Emit a success message to the parent
        emit('message', {
            success: true,
            text: 'Orden cancelada exitosamente.',
        });

        // Emit an event to notify the parent component
        emit('order-canceled', props.orderId);

        // Close the modal
        closeModal();
    } catch (error) {

        // Emit an error message to the parent
        emit('message', {
            failure: true,
            text: 'Error al cancelar la orden.',
        });
    } finally {
        isCanceling.value = false;
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-dialog {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    padding: 1rem;
}

.modal-content {
    padding: 1rem;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.modal-title {
    margin: 0;
}

.modal-body {
    margin-bottom: 1rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
    margin-top: 1rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
}
</style>