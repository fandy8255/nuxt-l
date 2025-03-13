<template>
    <div>
        <!-- Button to Open Modal -->
        <button type="button" class="btn btn-primary text-light" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            Dejar Reseña
        </button>

        <!-- Modal -->
        <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="submitReviewModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content text-start">
                    <div class="modal-header">
                        <h5 class="modal-title" id="submitReviewModalLabel">Dejar Reseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="resetForm"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitReview">
                            <!-- Review Title -->
                            <div class="mb-3">
                                <label for="reviewTitle" class="form-label">Título de la Reseña</label>
                                <input type="text" class="form-control" id="reviewTitle" v-model="reviewTitle"
                                    required />
                            </div>

                            <!-- Review Description -->
                            <div class="mb-3">
                                <label for="reviewDescription" class="form-label">Descripción</label>
                                <textarea class="form-control" id="reviewDescription" v-model="reviewDescription"
                                    required></textarea>
                            </div>

                            <!-- Rating -->
                            <div class="mb-3">
                                <label for="rating" class="form-label">Calificación (1-5)</label>
                                <input type="number" class="form-control" id="rating" v-model="rating" min="1" max="5"
                                    required />
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="btn btn-primary text-light">Enviar Reseña</button>
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
import { ref } from 'vue';

// Define props
const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
    reviewedUserId: {
        type: String,
        required: true,
    },
});

const userStore = useUserStore();
const modalId = 'submitReviewModal';
const statusMessage = ref('');

// Form fields
const reviewTitle = ref('');
const reviewDescription = ref('');
const reviewReply = ref('');
const rating = ref(1);

// Emit events
const emit = defineEmits(['review-submitted', 'message']);

// Reset form fields
const resetForm = () => {
    reviewTitle.value = '';
    reviewDescription.value = '';
    rating.value = 1;
    statusMessage.value = '';
};

// Submit review
const submitReview = async () => {
    if (!reviewTitle.value || !reviewDescription.value || !rating.value) {
        statusMessage.value = 'Todos los campos obligatorios deben ser completados.';
        return;
    }

    if (rating.value < 1 || rating.value > 5) {
        statusMessage.value = 'La calificación debe estar entre 1 y 5.';
        return;
    }

    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const user=await userStore.getUser()

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(userStore.user_tok),
            },
            body: JSON.stringify({
                reviewed_by: user.id, // The buyer submitting the review
                review_title: reviewTitle.value,
                review_description: reviewDescription.value,
                reviewed_user: props.reviewedUserId, // The seller being reviewed
                rating: rating.value,
                order_id: props.orderId, // The order ID
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit review');
        }

        const result = await response.json();

        // Add the new review to the userStore.reviews array
        userStore.addToReviews({
            id: result.reviewId, // Assuming the API returns the review ID
            reviewed_by: userStore.id,
            review_title: reviewTitle.value,
            review_description: reviewDescription.value,
            review_reply: reviewReply.value,
            reviewed_user: props.reviewedUserId,
            rating: rating.value,
            order_id: props.orderId,
            created_at: new Date().toISOString(), // Add a timestamp if needed
        });

        // Emit success message
        emit('message', {
            success: true,
            text: 'Reseña enviada exitosamente.',
        });

        // Emit review-submitted event
        emit('review-submitted', result.reviewId);

        // Close the modal
        document.querySelector('button.btn-close').click();
    } catch (error) {

        // Emit error message
        emit('message', {
            success: false,
            text: error.message || 'Error al enviar la reseña.',
        });
    }
};
</script>

<style scoped>
.modal-backdrop {
    z-index: 10 !important;
}
</style>