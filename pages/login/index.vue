<template>
    <div class="container mt-5">
        <br>
        <br>
        <div class="row justify-content-center">

            <MessageModal :message="message" @clear="clearMessage" />

            <div class="col-md-6 p-5 mb-5 border">
                <form @submit.prevent="loginUser" class="needs-validation" novalidate>
                    <h2 class="mb-4">Ingresa a tu Cuenta</h2>

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
        
        <div v-if="showResendModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reenviar Email de Confirmación</h5>
                        <button type="button" class="btn-close" @click="closeResendModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="resendEmail" class="form-label">Correo Electrónico</label>
                            <input v-model="resendEmail" type="email" class="form-control" id="resendEmail" required>
                            <div class="invalid-feedback">
                                Porfavor ingresa un correo válido
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="resendConfirmationEmail">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useRouter } from 'vue-router'

useSeoMeta({
    title: 'Latin Panty | Login',
    ogTitle: 'Latin Panty | Login',
    description: 'Ingresa y compra panties usados de Latinas',
    ogDescription: 'Compra panties usados de Latinas',
    ogImage: '',
    twitterCard: '',
})


const email = ref('')
const password = ref('')
const resendEmail = ref('')
const showResendModal = ref(false)
const message = ref('');
const clearMessage = () => {
    message.value = '';
};

const supabase = useSupabaseClient()
const router = useRouter()
const user = await supabase.auth.getUser()


onMounted(async () => {
    if (user.data.user) {
        router.push('/dashboard')
    }else{
        const userStore = useUserStore();
        userStore.signOut({
            username: '',
            email: '',
            id: '',
            age: null,
            user_type: '',
            profile_description: '',
            profile_picture: '',
            ubicacion: '',
            logged_in: false,
            user_tok: '',
            user_profile: '',
            products: [],
            followers: [],
            followed: [],
            liked_products: [],
            feed: [],
            blocked_users: [],
            blocked_by: [],
            message_count: 0
        });

    }
})

const openResendModal = () => {
    showResendModal.value = true
}
const closeResendModal = () => {
    showResendModal.value = false
}

const loginUser = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })

        if (error) throw error
        message.value = { success: 'Login Exitoso' };
        
        setTimeout(() => {
            router.push('/dashboard')
        }, 3000)
    

    } catch (error) {
        message.value = { failure: `No fue posible ingresar, porfavor revisa tus credenciales : ${error}` };
    }
}

const forgotPassword = async () => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.value)
        if (error) throw error
        message.value = { success: 'Te hemos enviado un email de confirmación, porfavor revisa tu correo' };
    } catch (error) {
        message.value = { failure: 'Hubo un problema reenviando el correo de confirmación' };
    }
}

const resendConfirmationEmail = async () => {
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: resendEmail.value,
            options: {
                emailRedirectTo: 'http://localhost:3000/confirm'
            }
        })

        if (error) throw error

        message.value = { success: 'Te hemos enviado un email de confirmación, porfavor revisa tu correo' };
        closeResendModal()
    } catch (error) {
        message.value = { failure: 'Hubo un problema reenviando el correo de confirmación' };
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