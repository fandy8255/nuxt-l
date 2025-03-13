<template>
    <div class="interview-component">
        <!-- Add Custom Question Form -->
        <div class="mb-4">
            <h5>Add Your Own Question</h5>
            <div class="input-group mb-3">
                <input v-model="newQuestion" type="text" class="form-control" placeholder="Enter your question" />
                <button class="btn btn-primary" @click="addCustomQuestion">Add Question</button>
            </div>
        </div>

        <!-- Suggested Questions -->
        <div class="mb-4">
            <h5>Suggested Questions</h5>
            <ul class="list-group">
                <li v-for="(question, index) in suggestedQuestions" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    {{ question }}
                    <button class="btn btn-sm btn-outline-primary" @click="addSuggestedQuestion(question)">
                        Add
                    </button>
                </li>
            </ul>
        </div>

        <!-- User's Questions List -->
        <div>
            <h5>Your Questions</h5>
            <draggable v-model="userQuestions" item-key="id" @end="reorderQuestions">
                <template #item="{ element }">
                    <div class="list-group-item mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>{{ element.question }}</strong>
                            <button class="btn btn-sm btn-danger" @click="deleteQuestion(element.id)">
                                Delete
                            </button>
                        </div>
                        <textarea v-model="element.answer" class="form-control mt-2"
                            placeholder="Your answer..."></textarea>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
const userStore = useUserStore();

// State for new question input
const newQuestion = ref('');

// State for user's questions and answers
const userQuestions = ref([]);

// Suggested questions
const suggestedQuestions = ref([
    "What inspired you to start this business?",
    "What challenges have you faced, and how did you overcome them?",
    "What advice would you give to someone starting out?",
    "What are your future goals for this business?",
    "How do you handle customer feedback?",
]);

// Fetch questions from the API
const fetchQuestions = async () => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();
    
    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/interview/questions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User':JSON.stringify(user)
        }
    });
    const data = await response.json();
    userQuestions.value = data;
};

// Add a custom question
const addCustomQuestion = async () => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();

    if (newQuestion.value.trim()) {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/add-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User':JSON.stringify(user)
            },
            body: JSON.stringify({ question: newQuestion.value }),
        });
        const data = await response.json();
        userQuestions.value.push({ id: data.id, question: newQuestion.value, answer: '', order_: userQuestions.value.length + 1 });
        newQuestion.value = ''; // Clear input
    }
};

// Add a suggested question
const addSuggestedQuestion = async (question) => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();
    const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/add-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User':JSON.stringify(user)
        },
        body: JSON.stringify({ question }),
    });
    const data = await response.json();
    userQuestions.value.push({ id: data.id, question, answer: '', order_: userQuestions.value.length + 1 });
};

// Delete a question
const deleteQuestion = async (id) => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();
    await fetch('https://lingerie.fandy8255.workers.dev/api/interview/delete-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User':JSON.stringify(user)
        },
        body: JSON.stringify({ id }),
    });
    userQuestions.value = userQuestions.value.filter((item) => item.id !== id);
    await reorderQuestions(); // Reorder after deletion
};

// Reorder questions
const reorderQuestions = async () => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();

    const updatedQuestions = userQuestions.value.map((item, index) => ({
        id: item.id,
        order_: index + 1, // Update order_ based on the new position
    }));
    await fetch('https://lingerie.fandy8255.workers.dev/api/interview/reorder-questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User':JSON.stringify(user)
        },
        body: JSON.stringify({ questions: updatedQuestions }),
    });
};

onMounted(() => {
    fetchQuestions();
});
</script>

<style scoped>
.interview-component {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.list-group-item {
    margin-bottom: 10px;
    border-radius: 8px;
}

textarea {
    resize: none;
    /* Disable resizing */
}
</style>