<template>
    <div class="card question-card border-0 my-2 shadow-sm">
        <div class="card-body">
            <!-- Question -->
            <div class="d-flex align-items-center mb-2">
                <strong>{{ question.order_ }}.</strong> 
                <!--
                <div class="order-circle bg-secondary text-light me-3">
                    
                </div>-->
                <h6 class="card-title mb-0 fw-bold">{{ question.question }}</h6>
            </div>

            <!-- Answer -->
            <div v-if="question.answer" class="card-text small">
                <strong>Respuesta</strong>
                <p class="mb-0">{{ question.answer }}</p>
            </div>
            <div v-else class="card-text small text-muted">
                <p class="mb-0">No Respondido</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.question-card {
    border-radius: 8px;
}

.order-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
}

.card-footer {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-title {
        font-size: 1rem;
    }

    .card-text {
        font-size: 0.875rem;
    }
}
</style>