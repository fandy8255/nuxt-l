<template>
    <section class="hero text-white text-center d-flex justify-content-center align-items-center"
        :style="{ height: '60vh', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        <div class="container text-container">
            <h1 class="display-4 fw-bold mb-4" style="color: aliceblue !important;">{{ title }}</h1>
            <p class="fs-4 mb-4" style="color: aliceblue !important;">{{ subtitle }}</p>
            <!--
            <NuxtLink to="/shop" id="cta" class="btn text-success fw-semibold rounded-pill px-5 py-3"
                style="color: aliceblue !important;">
                Explorar Colección
            </NuxtLink>
            -->
        </div>
    </section>
</template>

<script setup>
// Define the props
const { imgUrl, title, subtitle } = defineProps({
    imgUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    }
});
</script>

<style scoped>

.text-container {
    background: rgba(109, 109, 109, 0.603);
    border-radius: 10px;
    width: fit-content;
    padding: 40px;
}

h1,
p {
    color: white;
}

#cta {
    background: rgb(205, 89, 213);
    color: white;
}
</style>