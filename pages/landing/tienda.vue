<template>
    <div>
        <section class="container-fluid py-5">
            <div class="row my-2">
                <div class="container-xl">
                    <h2 class="text-center mb-5 display-4 fw-bold">Conoce a Algunas de Sus Productos</h2>
                    <div class="row">
                        <!-- Tarjetas de Vendedoras -->
                        <div class="col-md-3 my-2" v-for="seller in sellers" :key="seller.username">
                            <div class="card text-center shadow-sm overflow-hidden seller-card">
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="seller-image" provider="bunny" :src="seller.profilePicture"
                                        :quality="50" placeholder="/assets/images/panty-icon.jpg" />
                                </NuxtLink>
                                <div class="card-body">
                                    <h5 class="card-title">{{ seller.username }}</h5>
                                    <p class="seller-age"><strong>Precio:</strong> {{ seller.price }} USD</p>
                                    <p class="seller-location"><strong>Ubicación:</strong> {{ seller.location }}</p>
                                    <p class="seller-description">{{ seller.description }}</p>
                                    <button class="btn btn-outline-success btn-sm">Ver Perfil</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const sellers = [
    {
        username: "Panty Usado",
        profilePicture: "/landing/tienda/1.PNG",
        price: 25,
        description: "Panties Usados"
    },
    {
        username: "Mis Bragas",
        profilePicture: "/landing/tienda/2.jpg",
        price: 15,
        description: "Escíbeme BB , Panties Usados"
    },
    {
        username: "Panties",
        profilePicture: "/landing/tienda/3.jpg",
        price: 20,
        description: "Chicos del Perú para mis panties usados."
    },
    {
        username: "Panty Usado por 3 días",
        profilePicture: "/landing/tienda/4.jpeg",
        price: 20,
        description: "Tanguitas"
    },
    {
        username: "Tanga Usada",
        profilePicture: "/landing/tienda/5.jpg",
        price: 15,
        description: "Panties Usados"
    },
    {
        username: "Contenido",
        profilePicture: "/landing/tienda/6.jpg",
        price: 10,
        description: "Tangas Usadas"
    },
    {
        username: "Braguitas",
        profilePicture: "/landing/tienda/7.jpg",
        price: 17,
        description: "Lencería Íntima"
    },
    {
        username: "Panties",
        profilePicture: "/landing/tienda/8.jpg",
        price: 15,
        description: "Panties"
    },
];
</script>

<style scoped>
.seller-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.seller-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.seller-image {
    max-height: 600px;
    width: 100%;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.card-body {
    padding: 1.5rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
}

.seller-age,
.seller-location,
.seller-description {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.seller-description {
    color: #666;
    font-style: italic;
}

.btn-outline-success {
    margin-top: 1rem;
}
</style>