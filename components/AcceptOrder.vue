<template>
    <div>
        <!-- Accept Order Button -->
        <button class="btn btn-success text-light" @click="openModal">
            Aceptar Orden
        </button>

        <!-- Bootstrap Modal -->
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Aceptar Orden {{ orderId }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de aceptar la orden?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary text-light" @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-success text-light" @click="submitAcceptOrder"
                            :disabled="isAccepting">
                            {{ isAccepting ? 'Aceptando...' : 'Sí, Aceptar Orden' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

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

const emit = defineEmits(['order-accepted', 'message']);

const userStore = useUserStore();
const isModalOpen = ref(false);
const isAccepting = ref(false);

// Open the modal
const openModal = () => {
    isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
    isModalOpen.value = false;
};

// Submit the accept order request
const submitAcceptOrder = async () => {
    isAccepting.value = true;

    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const user= await userStore.getUser()

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/accept-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
            body: JSON.stringify({ orderId: props.orderId }),
        });

        if (!response.ok) throw new Error('Failed to accept order');

        // Emit a success message to the parent
        emit('message', {
            success: true,
            text: 'Orden aceptada exitosamente.',
        });

        // Emit an event to notify the parent component
        emit('order-accepted', props.orderId);

        // Close the modal
        closeModal();
    } catch (error) {
        console.error('Error accepting order:', error);

        // Emit an error message to the parent
        emit('message', {
            failure: true,
            text: 'Error al aceptar la orden.',
        });
    } finally {
        isAccepting.value = false;
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