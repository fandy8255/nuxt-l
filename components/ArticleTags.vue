<template>
    <div class="tags-section">
        <div class="d-flex flex-wrap gap-2">
            
            <span v-for="tag in tags" :key="tag" class="taggy badge bg-secondary text-light fw-normal">

                <NuxtLink :to="'/revista/etiquetas/' + tag" class="text-light">
                    {{ tag }}
                </NuxtLink>

            </span>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    tags: {
        type: Object,
        required: true,
    }
});

</script>

<style scoped>
.taggy {
    background: rgba(219, 74, 132) !important;
}


.badge {
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.badge:hover {
    opacity: 0.8;
}
</style>