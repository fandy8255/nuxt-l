<template>
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content p-5 position-relative">
            <!-- Close Button -->
            <button class="close-button" @click="closePopup">
                &times; <!-- This is the "X" symbol -->
            </button>

            <!-- Tabs for Register and Login -->
            <h5 class="p-2 text-center">
                Registrate o ingresa para ver todos nuestros artículos
            </h5>

            <div class="tabs">
                <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
                    Ingresa
                </button>
                <button :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
                    Registrate
                </button>
            </div>

            <!-- Login Form -->
            <div v-if="activeTab === 'login'" class="form-container" id="login-form">
                <form @submit.prevent="loginUser">
                    <div class="form-group">
                        <label for="login-email">Correo</label>
                        <input v-model="loginEmail" type="email" id="login-email" required
                            placeholder="Ingresa tu correo" />
                    </div>
                    <div class="form-group">
                        <label for="login-password">Contraseña</label>
                        <input v-model="loginPassword" type="password" id="login-password" required
                            placeholder="Ingresa tu contraseña" />
                    </div>
                    <button type="submit" class="btn-primary text-light">Login</button>
                </form>
            </div>

            <!-- Register Form -->
            <div v-else  class="form-container">
                <form @submit.prevent="registerUser">
                    <div class="form-group">
                        <label for="register-email">Correo Electrónico</label>
                        <input v-model="registerEmail" type="email" id="register-email" required
                            placeholder="Ingresa tu correo" />
                    </div>
                    <div class="form-group">
                        <label for="register-username">Nombre de Usuario</label>
                        <input v-model="registerUsername" type="text" id="register-username" required
                            placeholder="Ingresa un usuario único" />
                    </div>
                    <div class="form-group">
                        <label for="register-dateOfBirth">Fecha de Nacimiento</label>
                        <input v-model="registerDateOfBirth" type="date" id="register-dateOfBirth" required
                            @change="validateAge" />
                        <div v-if="!isAgeValid" class="invalid-feedback">
                            Debes tener más de 18 años para registrarte.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="register-ubicacion">Ubicación</label>
                        <select v-model="registerUbicacion" id="register-ubicacion" required>
                            <option value="Colombia">Colombia</option>
                            <option value="Peru">Peru</option>
                            <option value="España">España</option>
                            <option value="Ecuador">Ecuador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="register-userType">Tipo de Cuenta</label>
                        <select v-model="registerUserType" id="register-userType" required>
                            <option value="buyer">Comprador</option>
                            <option value="seller">Vendedora</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Contraseña</label>
                        <input v-model="registerPassword" type="password" id="register-password" required
                            placeholder="Ingresa tu contraseña" />
                    </div>
                    <div class="form-group">
                        <label for="register-confirm-password">Confirma tu Contraseña</label>
                        <input v-model="registerConfirmPassword" type="password" id="register-confirm-password" required
                            placeholder="Confirma tu contraseña" />
                    </div>
                    <button type="submit" class="btn-primary text-light" :disabled="!isFormValid">
                        Regístrate
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
/*
import { useRouter } from 'vue-router';
import { useSupabaseClient } from '#imports';
import { useUserStore } from '~/stores/userStore';*/

const router = useRouter();
const supabase = useSupabaseClient();
const userStore = useUserStore();

const showPopup = ref(false);
const activeTab = ref('login'); // Default to Login tab

// Login Form Data
const loginEmail = ref('');
const loginPassword = ref('');

// Register Form Data
const registerEmail = ref('');
const registerUsername = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const registerDateOfBirth = ref('');
const registerUbicacion = ref('Colombia');
const registerUserType = ref('buyer');
const isAgeValid = ref(false);
const userAge = ref(18);

// Check if the user is authenticated
const isAuthenticated = ref(false);

// Check authentication status
const checkAuth = async () => {
    const user = await userStore.getUser();
    isAuthenticated.value = !!user;
};

// Show popup after 30 seconds on allowed routes
const showPopupAfterDelay = () => {
    const allowedPaths = ['/revista'];
    const currentPath = router.currentRoute.value.path;

    if (allowedPaths.some((path) => currentPath.startsWith(path))) {
        setTimeout(() => {
            if (!isAuthenticated.value) {
                showPopup.value = true;
            }
        }, 5000); // 30 seconds
    }
};

// Close Popup
const closePopup = () => {
    showPopup.value = false;
};

// Validate Age
const validateAge = () => {
    const birthDate = new Date(registerDateOfBirth.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    isAgeValid.value = age >= 18;
    userAge.value = age;
};

// Check if the registration form is valid
const isFormValid = computed(() => {
    return (
        registerEmail.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) &&
        registerPassword.value.length >= 8 &&
        registerPassword.value === registerConfirmPassword.value &&
        isAgeValid.value
    );
});

// Login Function
const loginUser = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail.value,
            password: loginPassword.value,
        });

        if (error) throw error;

        // Update user store and close popup
        await userStore.getUser();
        showPopup.value = false;

        // Fetch user data
        await userStore.fetchUserData();

        // Redirect to the current route path
        const currentRoutePath = router.currentRoute.value.path;
        router.push(currentRoutePath);

    } catch (error) {
        alert(`Ingreso Fallido: ${error.message}`);
    }
};

// Register Function
const registerUser = async () => {
    if (!isFormValid.value) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: registerEmail.value,
            password: registerPassword.value,
            options: {
                emailRedirectTo: 'http://localhost:3000/confirm',
            },
        });

        if (error) {
            console.log('error', error)
            throw error;
        }

        // Save additional user data to your backend
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const result=await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                id: data.user.id,
                email: registerEmail.value,
                username: registerUsername.value,
                user_type: registerUserType.value,
                age: userAge.value,
                ubicacion: registerUbicacion.value,
            }),
        });

        console.log('result', result)

        alert('Registro Exitoso, Porfavor confirma tu correo para continuar');
        showPopup.value = false;
    } catch (error) {
        console.log('error', error)
        alert(`Registro Fallido: ${error.message}`);
    }
};

// Lifecycle Hooks
onMounted(async () => {
    await checkAuth();
    showPopupAfterDelay();
});

// Watch for route changes
watch(
    () => router.currentRoute.value.path,
    async () => {
        await checkAuth();
        showPopupAfterDelay();
    }
);
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    width: 40vw;
    position: relative;
    /* Required for positioning the close button */
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
}

.close-button:hover {
    color: #007bff;
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.tabs button {
    background: none;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
}

.tabs button.active {
    border-bottom: 2px solid #007bff;
    font-weight: bold;
}

.form-container {
    padding: 20px;
    margin-right: 30px;
    height: 40vh !important;
    overflow-y: auto !important;
}

#login-form{
    margin-top: 10px;
    height: 30vh !important;
    overflow: hidden !important;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn-primary {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.invalid-feedback {
    color: red;
    font-size: 12px;
}
</style>