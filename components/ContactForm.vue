<template>
    <form @submit.prevent="submitContactForm">
        <div class="mb-3">
            <label for="title" class="form-label">Nombre</label>
            <input type="text" id="title" class="form-control" v-model="contactForm.title" required />
        </div>
        <div class="mb-3">
            <label for="message" class="form-label">Mensaje</label>
            <textarea id="message" class="form-control" rows="5" v-model="contactForm.message" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary text-light">Enviar</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const router = useRouter()

const contactForm = ref({ title: "", message: "" });

const { receiver } = defineProps(['receiver'])
const userStore = useUserStore()

const submitContactForm = async () => {

    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);
        const user = await userStore.getUser()

        const formData = {
            title: contactForm.value.title,
            content: contactForm.value.message,
            receiver: receiver.id
        };

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/message', {
            method: 'POST',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user)
            },
            body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const result = await response.json();
        router.push({ path: "/mensajes" })
        contactForm.value.name = "";
        contactForm.value.message = "";
    } catch (error) {
        
    }
};
</script>

<style scoped></style>