<template>

    <section class="hero text-white text-center d-flex justify-content-center align-items-center"
        style="height: 100vh; background-image: url('/assets/images/hero-banner.jpg'); background-size: cover; background-position: center;">
        <div class="container">
            <h1 class="display-4 fw-bold mb-4">Encuentra Tu Estilo Sostenible</h1>
            <p class="fs-4 mb-4">Ropa de segunda mano, calidad y estilo para todos.</p>
            <NuxtLink to="/shop" id="cta" class="btn text-success fw-semibold rounded-pill px-5 py-3">
                Explorar Colección
            </NuxtLink>
        </div>
    </section>


</template>

<style>
h1,
p {
    color: white !important;
}

#cta {
    background: rgb(205, 89, 213) !important;
    color: white !important;
}
</style>