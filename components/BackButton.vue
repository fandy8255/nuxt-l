<template>
    <button class="btn btn-md text-light back-button" @click="goBack">
        ← Atrás
    </button>

</template>

<script setup>

const goBack = () => {
    const router = useRouter();
    // Check if there's history to go back to
    if (window.history.length > 1) {
        router.back();
    } else {
        // Fallback for when there's no history
        router.push('/');
    }
};

</script>

<style scoped>
.back-button {
    position: absolute !important;
    /* Changed from sticky to fixed */
    top: 12.5vh;
    /* Adjust as needed */
    left: 20px;
    /* Adjust as needed */
    z-index: 500;
    /* Ensures it stays above other content */
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.7);
    /* Semi-transparent black */
    border-radius: 50px;
    /* Pill shape */
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.back-button:hover {
    background-color: rgba(0, 0, 0, 0.9);
    /* Darker on hover */
    transform: translateX(-3px);
    /* Slight movement on hover */
}

/* For mobile responsiveness */
@media (max-width: 768px) {
    .back-button {
        top: 90vh;
        left: 10px;
        padding: 6px 12px;
        font-size: 14px;
    }
}
</style>
