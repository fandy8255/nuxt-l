<template>
    <div class="message-container container-xl">
        <h2 class="lead text-start container mb-3" v-if="otherUser">Conversación con: {{ otherUser.username }} {{ otherUser.id }}</h2>

        <!-- Message Display Section -->
        <div class="messages">
            <div v-if="messages" v-for="message in messages" :key="message.message_id" class="message"
                :class="{ 'my-message': message.message_owner === user.username, 'other-message': message.message_owner !== user.username }">
                {{ message }}
                <div class="message-header">
                    <UserImgComponent :image="message.sender_profile_picture" :username="message.sender_username" />
                </div>
                <p class="message-content">{{ message.content }}</p>
                <small class="message-time">{{ formatDate(message.created_at) }}</small>
            </div>
        </div>

        <!-- New Message Input Section -->
        <div class="new-message d-flex">
            <div style="width: 40vw;">
                <textarea v-model="newMessage" placeholder="Write your message..."
                    class="message-input col-10"></textarea>
                <button @click="sendMessage" class="send-btn col-2">Enviar</button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const threadId = useRoute().params.thread[0].toString();
const runtimeConfig = useRuntimeConfig();
const supabase = useSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
const userStore = useUserStore();

const otherUser = ref({});
const messages = ref([]);
const newMessage = ref('');

const fetchMessages = async () => {
    try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/thread?id=${threadId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                'X-User': JSON.stringify(user),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch threads');
        }

        let results = await response.json();
        messages.value = results.messages;
        console.log('dd', results.messages[0])
        console.log('dd', userStore.username)
        // Find the other user based on sender and receiver usernames
        let obj={
            username: null,
            id:null
        }
        const currentUserIsSender = results.messages[0]['sender_username'] === userStore.username;
        obj.username=results.messages[0][currentUserIsSender ? 'receiver_username' : 'sender_username'];
        obj.id=results.messages[0][currentUserIsSender ? 'receiver_id' : 'sender_id']
        otherUser.value = obj
    } catch (error) {
        console.error('Error fetching threads:', error);
    }
};

const sendMessage = async () => {
    if (newMessage.value.trim()) {
        try {
            const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                    'X-User': JSON.stringify(user),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver: otherUser.value.id,
                    content: newMessage.value,
                }),
            });

            if (response.ok) {
                await fetchMessages(); // Refresh messages after sending
                newMessage.value = ''; // Clear the input field
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
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
    background-color: #e0ffe0;

    /* Light green for the logged-in user */
    align-self: flex-start;
}

.other-message {
    background-color: #2c2c2c51;
    /* Light blue for the other user */
    align-self: flex-end;
    width: 40vw;
}

.message-header {
    display: flex;
    align-items: center;

}

.message-content {
    margin-top: 5px;
    /*color: white !important;*/
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
    width: 100%;
    max-width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
    resize: none;
}

.send-btn {
    /*padding: 10px 20px;*/
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
