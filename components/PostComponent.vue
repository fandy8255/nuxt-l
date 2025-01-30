<template>
    <form @submit.prevent="submitPost" class="post-form text-end">
        <textarea v-model="content" placeholder="Escribe tu publicación..." class="form-control" rows="4"
            required></textarea>
        <button type="submit" class="btn btn-primary mt-2" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Publicar' }}
        </button>
    </form>
</template>



<script setup>
import { ref, computed } from 'vue';
const runtimeConfig = useRuntimeConfig();

const content = ref('');
const isSubmitting = ref(false);
const userStore = useUserStore();
const contentLengthValid = computed(() => content.value.length >= 10 && content.value.length <= 500);

const submitPost = async () => {
    if (!contentLengthValid.value) {
        alert('El contenido debe tener entre 10 y 500 caracteres.');
        return;
    }

    isSubmitting.value = true;

    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/create-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
            },
            body: JSON.stringify({
                user_id: userStore.id,
                content: content.value,
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Publicación enviada correctamente.');
            content.value = ''; // Reset the text area
        } else {
            alert(data.message || 'Error al enviar la publicación.');
        }
    } catch (error) {
        console.error('Error al enviar la publicación:', error);
        alert('Hubo un error. Inténtalo nuevamente.');
    } finally {
        isSubmitting.value = false;
    }
};
</script>


<style scoped>
.post-form {
    /*max-width: 600px;*/
    width: 100%;
    margin: 0 auto;
}
</style>