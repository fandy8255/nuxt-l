<template>
    <div class="interview-component">
        <!-- Add Custom Question Form -->
        <div class="mb-4">
            <h5 class="mb-3">Crea Tu Propia Pregunta</h5>
            <div class="input-group custom-input-group">
                <input v-model="newQuestion" type="text" class="form-control" placeholder="Agrega tu pregunta" />
                <button class="btn btn-primary text-light" @click="addCustomQuestion">Agregar</button>
            </div>
        </div>

        <!-- Suggested Questions -->
        <div class="mb-4">
            <h5 class="mb-3">Preguntas Sugeridas</h5>
            <ul class="list-group">
                <li v-for="(question, index) in suggestedQuestions" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center border custom-list-item">
                    <span>{{ question }}</span>
                    <button class="btn btn-sm btn-outline-primary" @click="addSuggestedQuestion(question)">
                        Agregar
                    </button>
                </li>
            </ul>
        </div>

        <!-- User's Questions List -->
        <div>
            <h5 class="mb-3">Tus Preguntas</h5>
            <draggable v-model="userQuestions" item-key="id" @end="reorderQuestions">
                <template #item="{ element, index }">
                    <div class="list-group-item mb-3 custom-list-item">
                        <div class="d-flex align-items-center">
                            <!-- Order Number with Circle -->

                            <!-- Question and Actions -->
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex gap-2">
                                        <div class="order-circle text-light">
                                            {{ index + 1 }}
                                        </div>
                                        <strong class="question-text">{{ element.question }}</strong>
                                    </div>

                                    <button class="btn btn-sm btn-danger text-light"
                                        @click="deleteQuestion(element.id)">
                                        Eliminar
                                    </button>
                                </div>
                                <textarea v-model="element.answer" class="form-control mt-2 full-width-input" rows="4"
                                    placeholder="Your answer..." @input="handleAnswerInput(element)"></textarea>
                                <button v-if="element.isEdited" class="btn btn-sm btn-success text-light mt-2"
                                    @click="saveAnswer(element.id, element.answer)">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>

        <!-- Message Modal -->
        <MessageModal v-if="message" :message="message" @clear="clearMessage" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import MessageModal from './MessageModal.vue'; // Import the MessageModal component
const userStore = useUserStore();

// State for new question input
const newQuestion = ref('');

// State for user's questions and answers
const userQuestions = ref([]);

// State for modal messages
const message = ref(null);

// Suggested questions
const suggestedQuestions = ref([
    "Que fué lo que te inspiró para iniciar en este negocio de venta de panties?",
    "De 1-10 que tan activa es tu vida sexual?",
    "Cual es tu método anticonceptivo de preferencia?",
    "Que le recomendarías a alguien que quiera iniciar en este negocio?",
    "Cuales son tus metas a largo plazo en este negocio?",
    "Alguna vez has desarrollado una amistad con alguno de tus clientes?",
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
            'X-User': JSON.stringify(user),
        },
    });
    const data = await response.json();
    userQuestions.value = data.map((item) => ({ ...item, isEdited: false })); // Add isEdited flag
};

// Add a custom question
const addCustomQuestion = async () => {
    if (newQuestion.value.trim()) {
        userQuestions.value.push({
            id: `temp-${Date.now()}`, // Temporary ID for local use
            question: newQuestion.value,
            answer: '',
            order_: userQuestions.value.length + 1,
            isEdited: false, // Initialize isEdited flag
        });
        newQuestion.value = ''; // Clear input
        showMessage({ success: true, text: 'Pregunta añadida exitosamente' });
    }
};

// Add a suggested question
const addSuggestedQuestion = async (question) => {
    userQuestions.value.push({
        id: `temp-${Date.now()}`, // Temporary ID for local use
        question,
        answer: '',
        order_: userQuestions.value.length + 1,
        isEdited: false, // Initialize isEdited flag
    });
    showMessage({ success: true, text: 'Pregunta añadida exitosamente' });
};

// Delete a question
const deleteQuestion = async (id) => {
    if (id.startsWith('temp-')) {
        // Remove locally if it's a temporary question
        userQuestions.value = userQuestions.value.filter((item) => item.id !== id);
        showMessage({ success: true, text: 'Question deleted successfully!' });
    } else {
        // Delete from the database if it's a saved question
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);
        const user = await userStore.getUser();

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/delete-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            userQuestions.value = userQuestions.value.filter((item) => item.id !== id);
            await reorderQuestions(); // Reorder after deletion
            showMessage({ success: true, text: 'Pregunta eliminada satisfactoriamente' });
        } else {
            showMessage({ failure: true, text: 'Error al eliminar pregunta' });
        }
    }
};

// Save an answer
const saveAnswer = async (id, answer) => {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);
    const user = await userStore.getUser();

    // If the question is temporary, add it to the database first
    if (id.startsWith('temp-')) {
        const question = userQuestions.value.find((item) => item.id === id).question;
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/add-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
            body: JSON.stringify({ question }),
        });
        const data = await response.json();
        id = data.id; // Update the ID to the one returned by the database
    }

    // Update the answer
    const updateResponse = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/update-answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
        body: JSON.stringify({ id, answer }),
    });

    if (updateResponse.ok) {
        const questionIndex = userQuestions.value.findIndex((item) => item.id === id);
        if (questionIndex !== -1) {
            userQuestions.value[questionIndex].isEdited = false; // Reset isEdited flag
        }
        showMessage({ success: true, text: 'Pregunta guardada satisfactoriamente' });
    } else {
        showMessage({ failure: true, text: 'Error al guardar pregunta' });
    }
};

// Handle answer input
const handleAnswerInput = (element) => {
    element.isEdited = true; // Set isEdited flag when the user types in the textarea
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

    const response = await fetch('https://lingerie.fandy8255.workers.dev/api/interview/reorder-questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
        body: JSON.stringify({ questions: updatedQuestions }),
    });

    if (response.ok) {
        showMessage({ success: true, text: 'Preguntas reorganizadas satisfactoriamente' });
    } else {
        showMessage({ failure: true, text: 'Error al reorganizar preguntas' });
    }
};

// Show message in modal
const showMessage = (msg) => {
    message.value = msg;
    setTimeout(() => {
        clearMessage();
    }, 3000); // Auto-close after 3 seconds
};

// Clear message
const clearMessage = () => {
    message.value = null;
};

onMounted(() => {
    fetchQuestions();
});
</script>

<style scoped>
.interview-component {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
}

.custom-list-item {
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 15px;
    transition: box-shadow 0.2s ease-in-out;
    cursor: grab;
    /* Custom cursor for reordering */
}

.custom-list-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

textarea {
    resize: none;
    /* Disable resizing */
    height: 120px;
    /* Larger textarea */
}

.full-width-input {
    width: 100%;
}

.custom-input-group {
    display: flex;
    gap: 10px;
}

.custom-input-group .form-control {
    flex: 1;
}

.btn-danger,
.btn-success {
    color: white !important;
    /* Bootstrap 5 text-light */
}

.btn-outline-primary {
    border-color: #0d6efd;
    color: #0d6efd;
}

.btn-outline-primary:hover {
    background-color: #0d6efd;
    color: white;
}

.input-group {
    margin-bottom: 20px;
}

h5 {
    font-weight: 600;
    color: #333;
}

/* Order Number Circle */
.order-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--bs-secondary);
    /* Bootstrap secondary color */
    color: var(--bs-light);
    /* Bootstrap light text color */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    /* Smaller font size */
    font-weight: bold;
    margin-right: 10px;
    flex-shrink: 0;
}
</style>