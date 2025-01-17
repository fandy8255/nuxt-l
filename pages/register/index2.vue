<template>
  <div class="container p-4 my-5 shadow-sm border-sm">
    <br>
    <br>
    <br>
    <div class="row justify-content-center">
        <div class="container" v-if="message">
          <div class="container p-5" v-if="message.success">
            {{ message.success }}
          </div>
          <div class="container border rounded p-5" v-if="message.failure" >
            {{ message.failure }}
          </div>
        </div>
      <div class="col-md-6">
        <form @submit.prevent="registerUser" class="needs-validation" novalidate>
          <h2 class="mb-4">Create Your Account</h2>

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
            <input type="text" id="username" v-model="username" :placeholder="'Ingrese un nombre de usuario único'"
              class="form-control" required />
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
            <label for="userType" class="form-label">Tipo de Cuenta</label>
            <select v-model="userType" class="form-select" id="userType" required>
              <option value="buyer">Comprador</option>
              <option value="seller">Vendedora</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" id="password" required minlength="8">
            <div class="invalid-feedback">
              La contraseña debe tener por lo menos 8 carácteres
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirma tu contraseña</label>
            <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" required>
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
import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

useSeoMeta({
    title: 'Colombia Panty | Regístrate',
    ogTitle: 'Colombia Panty | Regístrate',
    description: 'Compra panties usados de Colombianas',
    ogDescription: 'Compra panties usados de Colombianas',
    ogImage: '',
    twitterCard: '',
})

// State variables
//const username = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const dateOfBirth = ref('')
const userType = ref('buyer')
const isAgeValid = ref(false)
const userAge = ref(18)
const message=ref('')

const runtimeConfig = useRuntimeConfig(/*event*/) //use for prod

// Supabase client
const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (user) {
    router.push('/dashboard')
  }

})

// Age validation
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

// Form validation
const isFormValid = computed(() => {
  return email.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    isAgeValid.value

  /*username.value.length >= 3 &&*/
})

// Registration method
const registerUser = async () => {
  try {
    // Step 1: Register user using Supabase Auth

    const userChecked = await fetch('https://lingerie.fandy8255.workers.dev/api/user/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`
      },
      body: JSON.stringify({
        username: username.value,
        email:email.value
      })
    });

    const resultChecked = await userChecked.json()
    console.log(resultChecked)

    if (resultChecked.success) {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: 'https://nuxt-l2.pages.dev/confirm',
        }
      });

      if (error) throw error;
      if (data) {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`
          },
          body: JSON.stringify({
            id: data.user.id,
            email: email.value,
            username: username.value,
            user_type: userType.value,
            age: userAge.value,
          })
        });
        const result = await response.json();
        //alert('Registro Exitoso , porfavor confirma tu correo para continuar');
        message.value={success:'Registro Exitoso , porfavor confirma tu correo para continuar'}
        router.push('/login');

      }
    }else{
      message.value={failure:'correo o usuario ya está en uso'}
      alert('correo o usuario ya está en uso');
    }

  } catch (error) {
    message.value={failure:'Error en el proceso de registro'}
    //console.error('Error en el proceso de registro', error.message);
    //alert('Error en el proceso de registro', error.message);
  }
};
</script>

<style scoped>
.needs-validation input:invalid {
  /*border-color: rgb(255, 0, 0);*/
}
</style>