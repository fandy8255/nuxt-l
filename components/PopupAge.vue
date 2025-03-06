<template>
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content">
            <p>Esta pagina contiene contenido adulto , eres mayor de 18 años?</p>
            <button @click="handleYes">Si, tengo más de 18 años</button>
            <button @click="handleNo">No</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#app';

const router = useRouter();
const showPopup = ref(false);
const ageVerifiedCookie = useCookie('ageVerified');

const allowedPaths = [
    '/landing/vendedoras',
    '/landing/tienda',
    '/revista',
    '/revista/category/instagram',
    '/revista/category/onlyfans',
    '/revista/article',
    /*
    '/revista/article2',
    '/revista/article3',
    '/revista/article4',
    '/revista/article5',
    '/revista/article6',*/
];

const isRouteAllowed = (path) => {
    // Check if the path is explicitly allowed
    if (allowedPaths.includes(path)) {
        return true;
    }

    // Check if the path starts with '/revista/' (dynamic route)
    if (path.startsWith('/revista/')) {
        return true;
    }

    return false;
};

const handleYes = () => {
    ageVerifiedCookie.value = 'true';
    showPopup.value = false;
};

const handleNo = () => {
    router.push('/');
};

const checkPopup = () => {
    if (!ageVerifiedCookie.value && isRouteAllowed(router.currentRoute.value.path)) {
        showPopup.value = true;
    } else {
        showPopup.value = false;
    }
};

onMounted(() => {
    checkPopup();
});

// Watch for route changes
watch(
    () => router.currentRoute.value.path,
    (newPath) => {
        checkPopup();
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
    text-align: center;
}

button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    opacity: 0.8;
}
</style>