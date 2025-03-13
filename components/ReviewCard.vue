<template>
    <div class="card review-card border-1 my-2 shadow-sm">
        <div class="card-body">
            <!-- Reviewer Info -->
            <div class="d-flex align-items-center mb-2">
                <UserImgComponent :image="review.reviewed_by_profile_picture" :username="review.reviewed_by_username" />
            </div>

            <!-- Rating Section -->
            <div class="rating-stars mb-2">
                <span v-for="star in review.rating" :key="star" class="fs-6">
                    ⭐
                </span>
            </div>

            <!-- Review Title and Description -->
            <h6 class="card-title mb-2">{{ review.review_title }}</h6>
            <p class="card-text mb-2 small">{{ review.review_description }}</p>

            <!-- Seller Reply (if available) -->
            <div v-if="review.review_reply" class="seller-reply mt-2 p-2 bg-light rounded small">
                <strong>Respuesta del vendedor:</strong>
                <p class="mb-0">{{ review.review_reply }}</p>
            </div>
        </div>

        <!-- Footer with Review Date -->
        <div class="card-footer border-top bg-light p-2">
            <small class="text-muted">
                {{ new Date(review.review_created_at).toLocaleDateString('en-GB') }}
            </small>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    review: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.review-card {
    border-radius: 8px;
}

.rating-stars {
    display: flex;
    gap: 2px;
    /* Smaller space between stars */
}

.seller-reply {
    background-color: #f8f9fa;
    border-radius: 4px;
}

.card-footer {
    padding: 0.5rem 1rem;
    /* Reduced padding */
    margin: 0;
    /* Remove margin */
    background-color: #f0f0f0;
    /* Slightly darker background */
    border-top: 1px solid #ddd;
    /* Add border top */
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-title {
        font-size: 1rem;
        /* Smaller title on mobile */
    }

    .card-text,
    .seller-reply {
        font-size: 0.875rem;
        /* Smaller text on mobile */
    }

    .rating-stars {
        gap: 1px;
        /* Even smaller space between stars on mobile */
    }
}
</style>