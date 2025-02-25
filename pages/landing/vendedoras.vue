<template>
    <div>
        <section class="container-fluid py-5">
            <div class="row my-2">
                <div class="container-xl">
                    <h2 class="text-center mb-5 display-4 fw-bold">Conoce a Algunas de Nuestras Vendedoras</h2>
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
                                    <p class="seller-age"><strong>Edad:</strong> {{ seller.age }}</p>
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
        username: "Jully99",
        profilePicture: "/landing/vendedoras/1.jpg",
        age: 25,
        location: "Ciudad de México, México",
        description: "Hola chicos acabo de empezar con esto de vender mis braguitas"
    },
    {
        username: "Karen_mm",
        profilePicture: "/landing/vendedoras/9.jpeg",
        age: 30,
        location: "Medellín, Colombia",
        description: "Escíbeme BB , vendo panties ,contenido y más."
    },
    {
        username: "Amarte998",
        profilePicture: "/landing/vendedoras/3.jpg",
        age: 28,
        location: "Lima, Perú",
        description: "Chicos del Perú hola."
    },
    {
        username: "Sammyh",
        profilePicture: "/landing/vendedoras/4.jpg",
        age: 22,
        location: "Santiago, Chile",
        description: "Acá en santiago y con ganas de vender más tangas"
    },
    {
        username: "Kelly",
        profilePicture: "/landing/vendedoras/5.jpg",
        age: 28,
        location: "Bogotá, Colombia",
        description: "Vendo panties contenido y videos con mi pareja"
    },
    {
        username: "Dayana",
        profilePicture: "/landing/vendedoras/6.PNG",
        age: 22,
        location: "Quito,Ecuador",
        description: "Ofrece prendas íntimas usadas con un estilo ardiente y sensual."
    },
    {
        username: "Diana",
        profilePicture: "/landing/vendedoras/7.jpeg",
        age: 22,
        location: "Pereira, Colombia",
        description: "Lencería íntima usada que despierta tus sentidos y te deja con ganas de más."
    },
    {
        username: "Delfina2000",
        profilePicture: "/landing/vendedoras/8.jpg",
        age: 22,
        location: "Buenos Aires, Argentina",
        description: "Especializada en prendas íntimas usadas que te harán sentir su presencia."
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