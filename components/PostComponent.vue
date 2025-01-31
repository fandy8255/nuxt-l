<template>
    <div>
        <div class="container">
            <MessageModal :message="message" @clear="clearMessage" style="z-index: 105 !important;" />
        </div>
        <form @submit.prevent="submitPost" class="post-form text-end">
            <textarea v-model="content" placeholder="Escribe tu publicación..." class="form-control" rows="4"
                required></textarea>
            <div class="d-flex align-items-center gap-2 mt-2 justify-content-end">
                <FileUploadForm v-if="userStore.user_type === 'seller'" @success="handleSuccess" @updateProductsStore="feedUpdate"/>
                <button type="submit" class="btn btn-primary text-light" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Enviando...' : 'Publicar' }}
                </button>
            </div>
        </form>

    </div>
</template>



<script setup>
import { ref, computed } from 'vue';
const runtimeConfig = useRuntimeConfig();

const content = ref('');
const isSubmitting = ref(false);
const userStore = useUserStore();
const contentLengthValid = computed(() => content.value.length >= 10 && content.value.length <= 500);
const emit = defineEmits(['updateFeed'])

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
            console.log('post22', data.result.results[0])
            let feedItem={...data.result.results[0]}
            feedItem.type='post'
            feedItem.profile_picture=userStore.profile_picture
            feedItem.username=userStore.username
            console.log('feed item', feedItem)
            userStore.addToFeed(feedItem)
            emit('updateFeed')
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

function feedUpdate(){
    console.log('feed update triggered')
    //feedItems.value=userStore.feed
    emit('updateFeed')
}


const message = ref(null); // State for the modal message

const handleSuccess = (data) => {
    message.value = data; // Set the modal message
};

const clearMessage = () => {
    message.value = null; // Clear the modal message
};

</script>


<style scoped>
.post-form {
    max-width: 700px;
    /*width: 100%;*/
    margin: 0 auto;
}
</style>