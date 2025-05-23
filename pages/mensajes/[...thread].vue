<template>
    <div class="message-container container-xl card shadow-lg border-0 p-3 my-5">
        <h2 class="lead text-start container mb-3" v-if="otherUser">Conversación con: {{ otherUser.username }} </h2>

        <div class="messages">
            <div v-if="messages" v-for="message in messages" :key="message.message_id" class="d-flex"
                :class="{ 'justify-content-end': message.message_owner !== user.id , 'me-2':true }">
                <div class="message"
                    :class="{ 'my-message': message.message_owner === user.id, 'other-message': message.message_owner !== user.id }">

                    <div class="message-header">
                        <UserImgComponent
                            :image="message.message_owner === message.sender_id ? message.sender_profile_picture : message.receiver_profile_picture"
                            :username="message.message_owner === message.sender_id ? message.sender_username : message.receiver_username" />
                    </div>
                    <p class="message-content">{{ message.content }}</p>
                    <small class="message-time">{{ formatDate(message.created_at) }}</small>

                </div>

            </div>
        </div>

        <div class="new-message container-xl">
            <div class="row d-flex w-100">
                <textarea v-model="newMessage" placeholder="Write your message..." class="message-input col-9 me-5"></textarea>
                <button @click="sendMessage" class="send-btn col-2">Enviar</button>
            </div>
            

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const threadId = useRoute().params.thread[0].toString();
const userStore = useUserStore();
const user=userStore.user_tok
const otherUser = ref({});
const messages = ref([]);
const newMessage = ref('');

useSeoMeta({
  title: `Mensajes con ${otherUser.username}`,
  description: 'Mensajes',
  robots: 'noindex', // Prevent indexing
});

const fetchMessages = async () => {

    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);
        const user= await userStore.getUser()
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/thread?id=${threadId}`, {
            method: 'GET',
            headers: {
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch threads');
        }

        let results = await response.json();
        messages.value = results.messages;
    
        let obj = {
            username: null,
            id: null
        }
        const currentUserIsSender = results.messages[0]['sender_username'] === userStore.username;
        obj.username = results.messages[0][currentUserIsSender ? 'receiver_username' : 'sender_username'];
        obj.id = results.messages[0][currentUserIsSender ? 'receiver_id' : 'sender_id']
        otherUser.value = obj
    } catch (error) {
    }
};

const sendMessage = async () => {
    if (newMessage.value.trim()) {
        try {
            const timestamp = Date.now().toString();
            const signature = await userStore.generateHMACSignature(timestamp);

            const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/message`, {
                method: 'POST',
                headers: {
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver: otherUser.value.id,
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
    await fetchMessages();
});
</script>

<style scoped>
.message-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    max-height: 75vh;
}

h2 {
    text-align: center;
    font-weight: bold;
    color: #333;
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
}

.my-message {
    background-color: #dbdbdb;
    width: 40vw;
    border: none;
    align-self: flex-start;
}

.other-message {
    background-color: #2c2c2c51;
    border: none;
    align-self: flex-end;
    width: 40vw;
}

.message-header {
    display: flex;
    align-items: center;

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
