<template>
    <div>
        <section class="container-fluid p-5">
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
const baseUrl='https://latinpanty.com'
const provider=''

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

useSeoMeta({
    // Basic Meta Tags
    title: 'Latin Panty | Productos de Nuestras Vendedoras',
    description: 'Explora los productos exclusivos de nuestras vendedoras en Latin Panty. Encuentra panties usados, tangas, y más a precios increíbles. ¡Regístrate gratis y comienza a comprar!',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: 'panties usados, tangas usadas, productos exclusivos, vendedoras latinas, comprar panties, contenido exclusivo, medias usadas',
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: 'Latin Panty | Productos de Nuestras Vendedoras',
    ogDescription: 'Explora los productos exclusivos de nuestras vendedoras en Latin Panty. Encuentra panties usados, tangas, y más a precios increíbles. ¡Regístrate gratis y comienza a comprar!',
    ogImage: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first product's image or a generic banner
    ogUrl: `${baseUrl}/landing/tienda`, // Replace with your website URL
    ogType: 'website',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: 'Latin Panty | Productos de Nuestras Vendedoras',
    twitterDescription: 'Explora los productos exclusivos de nuestras vendedoras en Latin Panty. Encuentra panties usados, tangas, y más a precios increíbles. ¡Regístrate gratis y comienza a comprar!',
    twitterImage: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first product's image or a generic banner
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}/landing/tienda`, // Canonical URL for SEO

    // Structured Data (JSON-LD)
    /*
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Latin Panty | Productos de Nuestras Vendedoras',
                description: 'Explora los productos exclusivos de nuestras vendedoras en Latin Panty. Encuentra panties usados, tangas, y más a precios increíbles.',
                url: `${baseUrl}/landing/tienda`,
                image: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first product's image or a generic banner
                about: {
                    '@type': 'Thing',
                    name: 'Productos de Vendedoras',
                    description: 'Productos exclusivos de vendedoras latinas, incluyendo panties usados, tangas, y más.',
                },
            }),
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                itemListElement: sellers.map((seller, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Product',
                        name: seller.username,
                        description: seller.description,
                        image: seller.profilePicture,
                        price: `${seller.price} USD`,
                        url: `${baseUrl}/landing/tienda`, // Replace with the actual product URL if available
                    },
                })),
            }),
        },
    ],*/
});

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