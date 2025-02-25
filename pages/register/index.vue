<template>
    <div class="container my-5 shadow-sm">
        <div class="row justify-content-center">

            <MessageModal :message="message" @clear="clearMessage" />

            <div class="col-md-6 border p-5">
                <form @submit.prevent="registerUser" class="needs-validation" novalidate>
                    <h2 class="mb-4">Crea tu Cuenta</h2>

                    <div class="mb-3">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input v-model="email" type="email" class="form-control" id="email" required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                        <div class="invalid-feedback">
                            Porfavor ingresa una dirección de correo válida
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="username" class="form-label">Nombre de Usuario</label>
                        <input type="text" id="username" v-model="username"
                            :placeholder="'Ingrese un nombre de usuario único'" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label for="dateOfBirth" class="form-label">Fecha de Nacimiento</label>
                        <input v-model="dateOfBirth" type="date" class="form-control" id="dateOfBirth" required
                            @change="validateAge">
                        <div class="invalid-feedback">
                            Debes tener más de 18 años para registrarte
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="ubicacion" class="form-label">Ubicación</label>
                        <select v-model="ubicacion" class="form-select" id="ubicacion" required>
                            <option value="Colombia">Colombia</option>
                            <option value="Peru">Peru</option>
                            <option value="España">España</option>
                            <option value="Ecuador">Ecuador</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="userType" class="form-label">Tipo de Cuenta</label>
                        <select v-model="userType" class="form-select" id="userType" required>
                            <option value="buyer">Comprador</option>
                            <option value="seller">Vendedora</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input v-model="password" type="password" class="form-control" id="password" required
                            minlength="8">
                        <div class="invalid-feedback">
                            La contraseña debe tener por lo menos 8 carácteres
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirma tu contraseña</label>
                        <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword"
                            required>
                        <div class="invalid-feedback">
                            Contraseñas son diferentes
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="!isFormValid">
                        Regístrate
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSupabaseClient } from '#imports';

const email = ref('');
const username = ref('');
const password = ref('');
const ubicacion = ref('');
const confirmPassword = ref('');
const dateOfBirth = ref('');
const userType = ref('buyer');
const isAgeValid = ref(false);
const userAge = ref(18);
const message = ref('');

const supabase = useSupabaseClient();
const router = useRouter();

useSeoMeta({
    title: 'Latin Panty | Regístrate',
    ogTitle: 'Latin Panty | Regístrate',
    description: 'Compra panties usados de Latinas',
    ogDescription: 'Compra panties usados de Latinas',
    ogImage: '',
    twitterCard: '',
})

onMounted(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (user) {
        router.push('/dashboard')
    }
})


const validateAge = () => {
    const birthDate = new Date(dateOfBirth.value)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    isAgeValid.value = age >= 18
    userAge.value = age
}


const isFormValid = computed(() => {
    return email.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) &&
        password.value.length >= 8 &&
        password.value === confirmPassword.value &&
        isAgeValid.value
})

const clearMessage = () => {
    message.value = '';
};

async function generateHMACSignature(timestamp) {
    const runtimeConfig = useRuntimeConfig();
    const secretKey = runtimeConfig.public.secretApiKey;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const timestampData = encoder.encode(timestamp);

    const key = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, timestampData);

    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return signatureHex;
}


const registerUser = async () => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await generateHMACSignature(timestamp);
        const userChecked = await fetch('https://lingerie.fandy8255.workers.dev/api/user/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
            }),
        });

        const resultChecked = await userChecked.json();

        if (resultChecked.success) {
            const { data, error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    emailRedirectTo: 'https://nuxt-l2.pages.dev/confirm',
                },
            });

            if (error) throw error;

            if (data) {
                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                    },
                    body: JSON.stringify({
                        id: data.user.id,
                        email: email.value,
                        username: username.value,
                        user_type: userType.value,
                        age: userAge.value,
                        ubicacion: ubicacion.value
                    }),
                });

                const result = await response.json();
                message.value = { success: 'Registro exitoso. Por favor, confirma tu correo para continuar.' };
                router.push('/login');
            }
        } else {
            message.value = { failure: 'Correo o usuario ya está en uso' };
        }
    } catch (error) {
        message.value = { failure: 'Error en el proceso de registro' };
    }
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
    color: rgb(47, 45, 45) !important;
}

.modal-dialog {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    padding: 1rem;
    color: rgb(47, 45, 45) !important;
}

.modal-title,
.modal-body {
    color: rgb(47, 45, 45) !important;
}

.modal-success {
    border-left: 4px solid green;
}

.modal-failure {
    border-left: 4px solid red;
}
</style>