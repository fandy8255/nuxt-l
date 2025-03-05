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
import { ref } from 'vue'

useSeoMeta({
  title: 'Bogaloo',
  description: 'Bogaloo',
  robots: 'noindex', 
});

const email = ref('')
const password = ref('')

const message = ref('');
const clearMessage = () => {
    message.value = '';
};
const navbarStore = useNavbarStore();

const supabase = useSupabaseClient()
const router = useRouter()

const loginUser = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (error) throw error;

        setTimeout(async () => {
            await navbarStore.isAd().then(res => {
                if (res) {
                    router.push('/ad');
                } else {
                    message.value = { success: 'Incorrect Credentials' };
                }
            })
        }, 3000);

    } catch (error) {
        message.value = { failure: `No fue posible ingresar, porfavor revisa tus credenciales: ${error.message}` };
    }
};

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