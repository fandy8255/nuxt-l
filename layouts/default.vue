<template>
    <div v-if="!loading">
        <Navbar id="navbar" :isAd="navbarStore.is_admin" />
        <div class="slot-wrapper mt-1">
            <slot class="main-content"  />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Reactive state
const is_admin = ref(false);
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
    color: rgb(47, 45, 45) !important;
}

#navbar {
    z-index: 1000;
    margin: 0 !important;
    top: 0 !important;
}

a {
    color: rgb(0, 0, 0) !important;
}

a:hover {
    color: blue !important;
}

h2 {
    font-weight: 500;
    font-style: normal;
}

* {
    color: rgb(59, 59, 59) !important;
    text-decoration: none;
}

.slot-wrapper {
    margin-top: 10px !important;
}
</style>