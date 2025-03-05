<template>
    <div>
        <section class="container-fluid p-5">
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

const baseUrl="https://latinpanty.com"

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

useSeoMeta({
    // Basic Meta Tags
    title: 'Latin Panty | Conoce a Nuestras Vendedoras',
    description: 'Descubre a nuestras vendedoras de panties usados en Latinoamérica. Conoce sus historias, ubicaciones y ofertas exclusivas. ¡Regístrate gratis y comienza a explorar!',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: 'vendedoras de panties, panties usados, vendedoras latinas, comprar panties, contenido exclusivo, medias usadas, tangas usadas',
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: 'Latin Panty | Conoce a Nuestras Vendedoras',
    ogDescription: 'Descubre a nuestras vendedoras de panties usados en Latinoamérica. Conoce sus historias, ubicaciones y ofertas exclusivas. ¡Regístrate gratis y comienza a explorar!',
    ogImage: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first seller's image or a generic banner
    ogUrl: `${baseUrl}/landing/vendedoras`, // Replace with your website URL
    ogType: 'website',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: 'Latin Panty | Conoce a Nuestras Vendedoras',
    twitterDescription: 'Descubre a nuestras vendedoras de panties usados en Latinoamérica. Conoce sus historias, ubicaciones y ofertas exclusivas. ¡Regístrate gratis y comienza a explorar!',
    twitterImage: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first seller's image or a generic banner
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}/landing/vendedoras`, // Canonical URL for SEO

    // Structured Data (JSON-LD)
    /*
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Latin Panty | Conoce a Nuestras Vendedoras',
                description: 'Descubre a nuestras vendedoras de panties usados en Latinoamérica. Conoce sus historias, ubicaciones y ofertas exclusivas.',
                url: `${baseUrl}/vendedoras`,
                image: 'https://lingerie.b-cdn.net/landing/vendedoras/1.jpg', // Use the first seller's image or a generic banner
                about: {
                    '@type': 'Thing',
                    name: 'Vendedoras de Panties Usados',
                    description: 'Vendedoras latinas de panties usados, medias, y contenido exclusivo.',
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
                        '@type': 'Person',
                        name: seller.username,
                        description: seller.description,
                        image: seller.profilePicture,
                        age: seller.age,
                        location: seller.location,
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