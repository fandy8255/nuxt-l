<template>
    <div class="tags-section">
        <div class="d-flex flex-wrap gap-2">
            <!-- Add 'todos' tag -->
            <span class="badge bg-secondary text-light fw-normal" :class="{ 'bg-primary': selectedTag === 'todos' }"
                @click="selectTag('todos')">
                Todos
            </span>
            <!-- Display other tags -->
            <span v-for="(count, tag) in tags" :key="tag" class="taggy badge bg-secondary text-light fw-normal"
                :class="{ 'bg-primary': selectedTag === tag }" @click="selectTag(tag)">

                <NuxtLink v-if="isCategory" :to="'/revista/category/' + tag" class="text-light">
                    {{ tag }}
                </NuxtLink>
                
                <NuxtLink v-else :to="'/revista/etiquetas/' + tag" class="text-light">
                    {{ tag }}
                </NuxtLink>
                ({{ count }})
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    tags: {
        type: Object,
        required: true,
    }, isCategory: {
        type: Boolean,
        default: false
    }
});

//const emit = defineEmits(['select-tag']);
const selectedTag = ref('todos'); // Default to 'todos'

const selectTag = (tag) => {
    selectedTag.value = tag;
    // emit('select-tag', tag);
};
</script>

<style scoped>
.taggy {
    background: rgba(219, 74, 132) !important;
}

/* This will override both the default and hover states */
.taggy.bg-primary,
.badge.bg-primary {
    background: var(--bs-primary) !important;
}

.tags-section {
    margin-bottom: 40px;
}

.badge {
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.badge:hover {
    opacity: 0.8;
}
</style>