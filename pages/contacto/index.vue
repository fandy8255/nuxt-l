<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-9 col-md-11"> <!-- Wider container -->
                <div class="card shadow-lg" style="border-radius: 12px; border: none;">
                    <div class="card-body p-4 p-md-5">
                        <h2 class="text-center mb-4 fw-bold">Contáctanos</h2>
                        <form @submit.prevent="submitForm" ref="formElement">
                            <!-- Name Field -->
                            <div class="mb-4">
                                <label for="name" class="form-label fw-medium">Nombre</label>
                                <input v-model.trim="form.name" type="text" class="form-control p-3"
                                    :class="{ 'is-invalid': errors.name, 'bg-light': !form.name }" id="name"
                                    placeholder="Tu nombre completo" @blur="validateField('name')"
                                    style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div v-if="errors.name" class="invalid-feedback">
                                    {{ errors.name }}
                                </div>
                            </div>

                            <!-- Email Field -->
                            <div class="mb-4">
                                <label for="email" class="form-label fw-medium">Correo Electrónico</label>
                                <input v-model.trim="form.email" type="email" class="form-control p-3"
                                    :class="{ 'is-invalid': errors.email, 'bg-light': !form.email }" id="email"
                                    placeholder="tu@correo.com" @blur="validateField('email')"
                                    style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div v-if="errors.email" class="invalid-feedback">
                                    {{ errors.email }}
                                </div>
                            </div>

                            <!-- Subject Field -->
                            <div class="mb-4">
                                <label for="subject" class="form-label fw-medium">Título</label>
                                <input v-model.trim="form.subject" type="text" class="form-control p-3"
                                    :class="{ 'is-invalid': errors.subject, 'bg-light': !form.subject }" id="subject"
                                    placeholder="Asunto del mensaje" @blur="validateField('subject')"
                                    style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div v-if="errors.subject" class="invalid-feedback">
                                    {{ errors.subject }}
                                </div>
                            </div>

                            <!-- Message Field -->
                            <div class="mb-4">
                                <label for="message" class="form-label fw-medium">Mensaje</label>
                                <textarea v-model.trim="form.message" class="form-control p-3"
                                    :class="{ 'is-invalid': errors.message, 'bg-light': !form.message }" id="message"
                                    rows="5" placeholder="Escribe tu mensaje aquí..." @blur="validateField('message')"
                                    style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); resize: none;"></textarea>
                                <div v-if="errors.message" class="invalid-feedback">
                                    {{ errors.message }}
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid mt-4">
                                <button type="submit" class="btn btn-primary btn-md text-light fw-medium py-3"
                                    :disabled="isSubmitting"
                                    style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <span class="text-light" v-if="!isSubmitting">Enviar Mensaje</span>
                                    <span v-else class="spinner-border spinner-border-sm" role="status"
                                        aria-hidden="true"></span>
                                </button>
                            </div>

                            <!-- Status Message -->
                            <div v-if="message" class="mt-4 alert" :class="messageClass" style="border-radius: 8px;">
                                {{ message }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const errors = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const message = ref('')
const messageClass = ref('alert-info')
const isSubmitting = ref(false)

// Custom validation logic
const validateField = (field) => {
    if (field === 'email') {
        if (!form.email) {
            errors.email = 'El correo es requerido'
        } else if (!isValidEmail(form.email)) {
            errors.email = 'Ingresa un correo válido'
        } else {
            errors.email = ''
        }
    } else {
        if (!form[field]) {
            errors[field] = `Por favor completa este campo`
        } else {
            errors[field] = ''
        }
    }
}

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateForm = () => {
    let isValid = true
    Object.keys(form).forEach(field => {
        validateField(field)
        if (errors[field]) isValid = false
    })
    return isValid
}

const submitForm = async () => {
    // Prevent double submission
    if (isSubmitting.value) return;

    if (!validateForm()) {
        message.value = "Por favor completa todos los campos correctamente";
        messageClass.value = 'alert-danger';
        return;
    }

    isSubmitting.value = true;
    message.value = 'Enviando tu mensaje...';
    messageClass.value = 'alert-info';

    try {
        // Use useFetch instead of raw fetch (Nuxt 3 recommended)
        const { data, error } = await useFetch("/api/send-e", {
            method: "POST",
            body: JSON.stringify(form), // Explicitly stringify the body
            key: createUniqueKey() // Prevent duplicate calls
        });

        if (error.value) {
            throw error.value;
        }

        message.value = "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.";
        messageClass.value = 'alert-success';

        // Reset form
        form.name = '';
        form.email = '';
        form.subject = '';
        form.message = '';
        Object.keys(errors).forEach(key => errors[key] = '');

    } catch (error) {
        console.error(error);
        message.value = "Hubo un error al enviar el mensaje. Por favor intenta nuevamente.";
        messageClass.value = 'alert-danger';
    } finally {
        isSubmitting.value = false;
    }
};

// Helper function to generate unique keys for useFetch
const createUniqueKey = () => `submit-${Date.now()}`;
</script>

<style scoped>
.card {
    background-color: #ffffff;
}

.form-control {
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
}

.form-control:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.bg-light {
    background-color: #f8f9fa !important;
}

.btn-primary {
    background-color: #0d6efd;
    border: none;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.invalid-feedback {
    display: none;
    color: #dc3545;
    font-size: 0.875em;
    margin-top: 0.25rem;
}

.is-invalid {
    border-color: #dc3545 !important;
}

.is-invalid~.invalid-feedback {
    display: block;
}

.alert {
    border: none;
}

.alert-info {
    background-color: #e7f5ff;
    color: #1864ab;
}

.alert-success {
    background-color: #ebfbee;
    color: #2b8a3e;
}

.alert-danger {
    background-color: #fff5f5;
    color: #c92a2a;
}
</style>