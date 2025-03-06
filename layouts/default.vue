<template>
    <div v-if="!loading">
        <Navbar id="navbar" :isAd="navbarStore.is_admin" />
        <PopupAge />
        <div class="slot-wrapper">
            <slot class="main-content"  />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const navbarStore = useNavbarStore();

onMounted(async () => {
    
    await navbarStore.isAd(res=>{
        loading.value=false
    })
    loading.value = false;

});
</script>

<style>
* {
    font-family: "Geist", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

p {
    color: rgb(47, 45, 45) 
}

#navbar {
    z-index: 1000;
    margin: 0 !important;
    top: 0 !important;
}

a {
    color: rgb(0, 0, 0)
}

a:hover {
    color: rgb(0, 0, 0) !important;
    text-decoration: none !important;
}

h2 {
    
    font-weight: 500;
    font-style: normal;
}

* {
    color: rgb(59, 59, 59) !important;
    text-decoration: none !important;
}

.slot-wrapper {
    /*margin-top: 10px !important;*/
}
</style>