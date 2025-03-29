<template>
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup-container">
            <!-- Close Button -->
            <button class="close-button ms-2" @click="closePopup">
                &times;
            </button>

            <!-- Tabs for Register and Login -->
            <h5 class="popup-title text-center">
                Registrate o ingresa para ver todos nuestros artículos
            </h5>

            <div class="tabs">
                <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
                    Ingresa
                </button>
                <button :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
                    Regístrate
                </button>
            </div>

            <!-- Login Form -->
            <div v-if="activeTab === 'login'" class="form-content">
                <form @submit.prevent="loginUser" class="form-wrapper">
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
            <div v-else class="form-content">
                <form @submit.prevent="registerUser" class="form-wrapper scrollable-form">
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
        }, 15000); // 30 seconds
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

        const result = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
}

.popup-container {
    background-color: white;
    border-radius: 12px;
    position: relative;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 4px;
    line-height: 1;
}

.close-button:hover {
    color: #000;
}

.popup-title {
    padding: 20px 20px 10px;
    margin: 0;
    font-size: 1.25rem;
    color: #333;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 0 20px;
}

.tabs button {
    flex: 1;
    padding: 12px 0;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #666;
    position: relative;
    transition: all 0.2s ease;
}

.tabs button.active {
    color: #db4a84;
    font-weight: 600;
}

.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #db4a84;
}

.form-content {
    padding: 20px;
    height: 100%;
    min-height: 300px;
    max-height: calc(90vh - 150px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
}

.scrollable-form {
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: thin;
    scrollbar-color: #db4a84 #f5f5f5;
}

.scrollable-form::-webkit-scrollbar {
    width: 6px;
}

.scrollable-form::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
}

.scrollable-form::-webkit-scrollbar-thumb {
    background-color: #db4a84;
    border-radius: 3px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 0.9rem;
    color: #555;
    font-weight: 500;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: border 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #db4a84;
    box-shadow: 0 0 0 2px rgba(219, 74, 132, 0.1);
}

.btn-primary {
    padding: 12px;
    background-color: #db4a84;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 8px;
}

.btn-primary:hover {
    background-color: #c43d74;
}

.btn-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.invalid-feedback {
    color: #e74c3c;
    font-size: 0.8rem;
    margin-top: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .popup-container {
        max-width: 90%;
    }

    .popup-title {
        font-size: 1.1rem;
        padding: 16px 16px 8px;
    }

    .tabs {
        padding: 0 16px;
    }

    .tabs button {
        font-size: 0.95rem;
        padding: 10px 0;
    }

    .form-content {
        padding: 16px;
        max-height: calc(90vh - 130px);
    }

    .form-group input,
    .form-group select {
        padding: 8px 10px;
    }
}

@media (max-width: 480px) {

    .close-button{
        right: 2px;
        top: 2px;
        padding: 5px;
        width: 20px;
    }

    .popup-container {
        max-width: 95%;
    }

    .popup-title {
        font-size: 1rem;
        padding: 14px 14px 6px;
    }

    .form-content {
        padding: 12px;
        max-height: calc(90vh - 120px);
    }

    .form-group label {
        font-size: 0.85rem;
    }

    .btn-primary {
        padding: 10px;
        font-size: 0.95rem;
    }
}
</style>