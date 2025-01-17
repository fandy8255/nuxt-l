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
        <button type="submit" class="btn btn-primary">Enviar</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const router = useRouter()

const contactForm = ref({ title: "", message: "" });

const runtimeConfig = useRuntimeConfig();
const supabase = useSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
const { receiver } = defineProps(['receiver'])

console.log('teeerrrrreer')
console.log('user sent:', user)



const submitContactForm = async () => {

    console.log('user sent:', user)
    console.log('receiver', receiver.id)

    try {
        // Create form data object
        const formData = {
            title: contactForm.value.title,
            content: contactForm.value.message,
            receiver: receiver.id
        };

        console.log("formData: " , formData)

        // Send the data to your API
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/message', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                /*'Content-Type': "multipart/form-data",*/
                'X-User': JSON.stringify(user)
            },
            body: JSON.stringify(formData),
        });

        //console.log("formData: " , formData)
        

        if (!response.ok) {
            console.log("formData: " , formData)
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Message sent successfully:", result);
        router.push({ path: "/mensajes" })

        // Reset the form after successful submission
        contactForm.value.name = "";
        contactForm.value.message = "";
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
};
</script>

<style scoped></style>