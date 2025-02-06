<template>
    <div class="container mt-5">
        <br>
        <br>
        <div class="row justify-content-center">

            <MessageModal :message="message" @clear="clearMessage" />

            <div class="col-md-6 p-5 mb-5 border">
                <form @submit.prevent="loginUser" class="needs-validation" novalidate>
                    <h2 class="mb-4">Bogaloo</h2>

                    <div class="mb-3">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input v-model="email" type="email" class="form-control" id="email" required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                        <div class="invalid-feedback">
                            Ingresa una dirección de correo válida
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input v-model="password" type="password" class="form-control" id="password" required
                            minlength="8">
                        <div class="invalid-feedback">
                            Contraseña debe tener mínimo 8 carácteres
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">
                        Ingresa
                    </button>

                    <div class="text-center mt-3">
                        <a href="#" @click.prevent="forgotPassword">Olvidaste tu contraseña?</a>
                    </div>
                    <div class="text-center my-3">
                        <NuxtLink to="/register" class="text-decoration-none">No tienes una cuenta aún? Registrate
                        </NuxtLink>
                    </div>
                    <div class="text-center my-3">
                        <a href="#" @click.prevent="openResendModal">No has recibido un email de confirmación?</a>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const resendEmail = ref('')
const showResendModal = ref(false)
const message = ref('');
const clearMessage = () => {
    message.value = '';
};
//const emit = defineEmits(['updateNavbar']);
const navbarStore = useNavbarStore();

// Supabase and Router
const supabase = useSupabaseClient()
const router = useRouter()

// Open/Close Resend Modal
const openResendModal = () => {
    showResendModal.value = true
}
const closeResendModal = () => {
    showResendModal.value = false
}

const loginUser = async () => {
    try {
        // Step 1: Attempt Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (error) throw error;

        // Step 2: Generate HMAC signature for Cloudflare Worker request
        const timestamp = Date.now().toString(); // Prevent replay attacks
        const signature = await generateHMACSignature(timestamp);

        // Step 3: Fetch user profile from Cloudflare Worker to check if admin
        const isAdmin = await isAd(data.user, timestamp, signature);

        // Step 4: Redirect based on user role
        if (isAdmin) {
            console.log('hitt isadmin')
            message.value = { success: 'Login Exitoso' };
            //emit('updateNavbar')

            setTimeout(async () => {
                await navbarStore.updateNavbar()
                router.push('/ad'); // Redirect admin to admin page
            }, 3000);
        } else {
            message.value = { success: 'Incorrect Credentials' };
        }

    } catch (error) {
        message.value = { failure: `No fue posible ingresar, porfavor revisa tus credenciales: ${error.message}` };
    }
};

// HMAC Signature Generation
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

// Check if user is admin using Cloudflare Worker
async function isAd(user, timestamp, signature) {
    try {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        });

        const result = await response.json();
        console.log('is ad', result)
        return result?.data?.is_admin || false; // Return `is_admin` value or false if not found
    } catch (error) {
        console.error('Error fetching admin status:', error);
        return false; // Assume user is not admin if there's an error
    }
}

</script>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 1050;
}
</style>