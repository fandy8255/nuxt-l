<template>
    <div class="container mt-5">
        <br>
        <br>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <form @submit.prevent="loginUser" class="needs-validation" novalidate>
                    <h2 class="mb-4">Login to Your Account</h2>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input v-model="email" type="email" class="form-control" id="email" required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                        <div class="invalid-feedback">
                            Please enter a valid email address
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="password" type="password" class="form-control" id="password" required
                            minlength="8">
                        <div class="invalid-feedback">
                            Password must be at least 8 characters long
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">
                        Login
                    </button>

                    <div class="text-center mt-3">
                        <a href="#" @click.prevent="forgotPassword">Forgot Password?</a>
                    </div>
                    <div class="text-center my-3">
                        <NuxtLink to="/register" class="text-decoration-none">No tienes una cuenta aún? Registrate</NuxtLink>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useRouter } from 'vue-router'

// State variables
const email = ref('')
const password = ref('')

// Supabase and Router
const supabase = useSupabaseClient()
const router = useRouter()
const session = useSupabaseSession();



onMounted(async ()=>{

    if (session) {
      router.push('/dashboard')
    }

})

// Login method
const loginUser = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })

        if (error) throw error

        // Redirect to dashboard or home page after successful login
        router.push('/dashboard')
    } catch (error) {
        console.error('Login error:', error.message)
        alert(error.message)
    }
}

// Forgot password method
const forgotPassword = async () => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.value)

        if (error) throw error

        alert('Password reset email sent. Check your inbox.')
    } catch (error) {
        console.error('Password reset error:', error.message)
        alert(error.message)
    }
}
</script>