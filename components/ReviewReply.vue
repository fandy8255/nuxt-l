<template>
    <div>
        <!-- Button to Open Modal -->
        <button type="button" class="btn btn-primary text-light" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            {{ review.review_reply ? 'Editar' : 'Responder' }}
        </button>

        <!-- Modal -->
        <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="reviewReplyModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content text-start">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reviewReplyModalLabel">Responder a la Reseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitReviewReply">
                            <!-- Review Reply -->
                            <div class="mb-3">
                                <label for="reviewReply" class="form-label">Respuesta</label>
                                <textarea class="form-control" id="reviewReply" v-model="reviewReply"
                                    required></textarea>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="btn btn-primary text-light">Enviar Respuesta</button>
                        </form>

                        <!-- Status Message -->
                        <p class="mt-3">{{ statusMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Define props
const props = defineProps({
    review: {
        type: Object,
        required: true,
    },
});

const userStore = useUserStore();
const modalId = `reviewReplyModal-${props.review.review_id}`; // Unique modal ID for each review
const statusMessage = ref('');

// Form fields
const reviewReply = ref(props.review.review_reply || '');

// Emit events
const emit = defineEmits(['reply-submitted', 'message']);

// Reset form fields
const resetForm = () => {
    reviewReply.value = props.review.review_reply || '';
    statusMessage.value = '';
};

// Submit review reply
const submitReviewReply = async () => {
    if (!reviewReply.value) {
        statusMessage.value = 'La respuesta no puede estar vacía.';
        return;
    }

    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const user=await userStore.getUser()
        console.log('submitted this', {
                review_id: props.review.review_id,
                review_reply: reviewReply.value,
                seller_id: user.id, 
            })

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/submit-review-reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(userStore.user_tok),
            },
            body: JSON.stringify({
                review_id: props.review.review_id,
                review_reply: reviewReply.value,
                seller_id: user.id, 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit review reply');
        }

        const result = await response.json();

        // Emit success message
        emit('message', {
            success: true,
            text: 'Respuesta enviada exitosamente.',
        });

        // Emit reply-submitted event
        emit('reply-submitted', result.reviewId);

        // Close the modal
        document.querySelector('button.btn-close').click();
    } catch (error) {
        // Emit error message
        emit('message', {
            success: false,
            text: error.message || 'Error al enviar la respuesta.',
        });
    }
};
</script>

<style scoped>
/*
.modal-backdrop {
    z-index: 10 !important;
}*/
</style>