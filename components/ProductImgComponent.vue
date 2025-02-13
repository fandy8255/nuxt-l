<template>
    <div class="user-img-card d-flex align-items-center gap-2" style="width: fit-content;">
        <NuxtLink :to="'/tienda/' + id">
        <NuxtImg provider="bunny" :src="image" class="rounded-circle" width="50px" height="50px" alt="User Image"
            :quality="10" loading="lazy" placeholder="/assets/images/panty-icon.jpg" />
        </NuxtLink>
        <span class="fw-bold spans">{{ username }}</span>
    </div>
</template>

<script setup>
defineProps({
    image: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.rounded-circle {
    object-fit: cover;
}
</style>