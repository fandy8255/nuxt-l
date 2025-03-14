<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Questions List -->
        <div v-else>
            <div v-if="questions.length > 0">
                <InterviewCard v-for="question in questions" :key="question.id" :question="question" />
            </div>
            <div v-else>
                <p>No questions to display.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
/*
import InterviewQuestionCard from './InterviewQuestionCard.vue'; // Import the InterviewQuestionCard component*/
const userStore = useUserStore();

const questions = ref([]);
const loading = ref(true);

// Fetch questions from the API
const fetchQuestions = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const user = await userStore.getUser();

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/questions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        });

        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        questions.value = data; // Data is already ordered by `order_` from the API
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchQuestions();
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>