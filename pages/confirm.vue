<template>
    <div>
        <div>
            <br>
            <br>
            <br>
            <div class="container p-4">
                <h1>Tu cuenta ha sido confirmada</h1>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted } from 'vue';
const router = useRouter()

useSeoMeta({
    title: 'Colombia Panty | Confirma tu correo',
    ogTitle: 'Colombia Panty | Confirma tu correo',
    description: 'Confirma tu correo y compra panties usados de Colombianas',
    ogDescription: 'Compra panties usados de Colombianas',
    ogImage: '',
    twitterCard: '',
})

onMounted(()=>{
    setTimeout(()=>{
        router.push('/login')
    },3000)
   
})
    
</script>

<style scoped>

</style>