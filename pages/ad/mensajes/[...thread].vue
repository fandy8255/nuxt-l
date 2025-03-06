<template>
    <div class="message-container container-xl card shadow-lg border-0 p-3 my-5">
        <!-- Message Display Section -->
        <div class="messages" v-if="!loading">
            <h4 class="p-3">Messages between sender: {{ threadInfo.sender}} and receiver {{threadInfo.receiver }}</h4>
            <div v-if="messages" v-for="message in messages" :key="message.message_id" class="message">
       
                <div class="message-header">
                    <UserImgComponent
                            :image="message.message_owner === message.sender_id ? message.sender_profile_picture : message.receiver_profile_picture"
                            :username="message.message_owner === message.sender_id ? message.sender_username : message.receiver_username" />
                </div>
                <p class="message-content">{{ message.content }}</p>
                <small class="message-time">{{ formatDate(message.created_at) }}</small>
            </div>
        </div>
        <div v-else>
            <div class="row w-100 d-flex justify-content-center align-items-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

        <!-- New Message Input Section -->
        <div class="new-message container-xl">
            <div class="row d-flex w-100">
                <textarea v-model="newMessage" placeholder="Write your message..."
                    class="message-input col-9 me-5"></textarea>
                <button @click="sendMessage" class="send-btn col-2">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const threadId = useRoute().params.thread[0].toString();
const navbarStore = useNavbarStore();
const messages = ref([]);
const newMessage = ref('');
const threadInfo = ref({});
const loading=ref(true)

definePageMeta({
  middleware: ["ad"]
})


useSeoMeta({
  title: 'Mensajes Thread',
  description: 'Mensajes Thraed',
  robots: 'noindex', 
});

const fetchMessages = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const user = await navbarStore.getUser();

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/thread?id=${threadId}`, {
            method: 'GET',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        
        const results = await response.json();
        let obj = {
            sender: results.messages[0]['sender_username'],
            receiver: results.messages[0]['receiver_username']
        }
        threadInfo.value=obj
        messages.value = results.messages;
    } catch (error) {
    }
};

const sendMessage = async () => {
    if (newMessage.value.trim()) {
        try {
            const timestamp = Date.now().toString(); 
            const signature = await navbarStore.generateHMACSignature(timestamp);
            const user = await navbarStore.getUser();

            const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/message`, {
                method: 'POST',
                headers: {
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    thread_id: threadId,
                    content: newMessage.value,
                }),
            });

            if (response.ok) {
                await fetchMessages(); 
                newMessage.value = ''; 
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            
        }
    }
};

const formatDate = (date) => new Date(date).toLocaleString();

onMounted(async () => {
    await fetchMessages().then(res=>{
        loading.value=false
    })
});
</script>

<style scoped>
.message-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    max-height: 75vh;
}

.messages {
    max-height: 60vh;
    overflow-y: scroll;
    margin-bottom: 20px;
}

.message {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.message-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.sender-name {
    font-weight: bold;
    margin-right: 5px;
}

.receiver-name {
    color: #666;
}

.message-content {
    margin-top: 5px;
    font-size: 1rem;
}

.message-time {
    margin-top: 5px;
    font-size: 0.8rem;
    color: #888;
}

.new-message {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
}

.message-input {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
    resize: none;
}

.send-btn {
    background-color: #5219ee;
    color: white !important;
    border: none;
    height: 60px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}

.send-btn:hover {
    background-color: #c114a7;
}
</style>