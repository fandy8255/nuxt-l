<template>
    <div>
        <!-- Hero Section -->
        <section class="text-center pb-xl-5 py-0 mt-0">
            <HeroBanner title="El Mercado #1 de Panties Usados en Latinoamérica"
                subtitle="Vender ropa interior usada es una excelente manera de convertir tus panties en dinero. Únete a más de 2,000,000 miembros reales en el mercado más grande para comprar y vender panties usados."
                cta-text="Regístrate Gratis" backgroundImage="/assets/images/hero-banner.jpg" :parallax="true"
                :gradient="false" height="90vh" @cta-click="handleCtaClick">
                <template #stats>
                    <div class="stats d-md-flex justify-content-center gap-xl-4 gap-1 mb-5 d-none ">
                        <div class="stat-item">
                            <i class="bi bi-people-fill"></i>
                            <h3 class="banner-headings text-light">1,468,444</h3>
                            <p class="banner-headings text-light">Vendedores</p>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-person-plus-fill"></i>
                            <h3 class="banner-headings text-light">1,854,140</h3>
                            <p class="banner-headings text-light">Compradores</p>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-camera-reels-fill"></i>
                            <h3 class="banner-headings text-light">855,612</h3>
                            <p class="banner-headings text-light">Archivos Multimedia</p>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-cash-coin"></i>
                            <h3 class="banner-headings text-light">883,569</h3>
                            <p class="banner-headings text-light">Tratos Privados</p>
                        </div>
                    </div>
                </template>
            </HeroBanner>
        </section>


        <section class="features-section py-5">
            <div class="container">
                <!-- Main Heading -->
                <h2 class="text-center mb-5 display-4">¿Por Qué Elegirnos?</h2>
                <Stats class="mt-3" />

                <!-- Two Columns -->
                <div class="row justify-content-around border rounded p-3 mt-3 gap-3">
                    <div class="col-md-5 me-5">
                        <h3 class="text-start mb-4">Para Vendedores</h3>
                        <ul class="list-unstyled">
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Seguro y Anónimo
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Tu Propio Sistema de Tienda
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Fija Tus Propios Precios
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Sin Comisiones
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Nuevos Compradores Diarios
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-5 ms-md-5 ms-0">
                        <h3 class="text-start mb-4">Para Compradores</h3>
                        <ul class="list-unstyled">
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Mensajes y Chat
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Mercado de Anuncios Clasificados
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Lista de Clasificación de Usuarios
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Reseñas de Miembros
                            </li>
                            <li class="mb-3">
                                <i class="fas fa-check-circle text-success me-2"></i> Funciones de Privacidad
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonials-section py-5 bg-light">
            <div class="container">
                <!-- Main Heading -->
                <h2 class="text-center mb-5 display-4">Lo Que Dicen Nuestros Miembros</h2>

                <!-- Testimonial Cards -->
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body text-center">
                                <!-- User Image -->
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="rounded-circle mb-3" provider="bunny" src="/landing/1.jpg"
                                        :width="'100px'" :height="'100px'" :quality="50"
                                        placeholder="/assets/images/panty-icon.jpg" />
                                </NuxtLink>

                                <!-- Rating -->
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                </div>

                                <!-- Testimonial Text -->
                                <p class="card-text">
                                    "¡Latin Panty fue curiosidad convertida en diversión a tiempo completo! En 6 meses
                                    vendí muchos artículos y llegué al top 25 de vendedores."
                                </p>

                                <!-- User Name and Age -->
                                <p class="text-muted mt-3">
                                    <strong>Dayana</strong> (28 Años)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body text-center">
                                <!-- User Image -->
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="rounded-circle mb-3" provider="bunny" src="/landing/2.jpg"
                                        :width="'100px'" :height="'100px'" :quality="50"
                                        placeholder="/assets/images/panty-icon.jpg" />
                                </NuxtLink>

                                <!-- Rating -->
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                </div>

                                <!-- Testimonial Text -->
                                <p class="card-text">
                                    "¡Latin Panty es muy divertido! Es un lugar seguro para explorar sin juicios. Como
                                    una
                                    de las mejores vendedoras, me encanta ser creativa y hacer felices a mis clientes."
                                </p>

                                <!-- User Name and Age -->
                                <p class="text-muted mt-3">
                                    <strong>Michelle</strong> (29 Años)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body text-center">
                                <!-- User Image -->
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="rounded-circle mb-3" provider="bunny" src="/landing/3.jpg"
                                        :width="'100px'" :height="'100px'" :quality="50"
                                        placeholder="/assets/images/panty-icon.jpg" />
                                </NuxtLink>

                                <!-- Rating -->
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                </div>

                                <!-- Testimonial Text -->
                                <p class="card-text">
                                    "Desde panties hasta calcetines y todo lo que puedas imaginar. ¡Este sitio es
                                    muy chévere y fácil de usar!"
                                </p>

                                <!-- User Name and Age -->
                                <p class="text-muted mt-3">
                                    <strong>Karen</strong> (25 Años)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- Categories Section -->
        <section class="categories-section py-5">
            <div class="container">
                <h2 class="text-center mb-5 display-4 fw-bold">Explora Categorías</h2>
                <div class="row">
                    <div class="col-md-3" v-for="category in categories" :key="category.name">
                        <div class="card text-center shadow-sm overflow-hidden">
                            <NuxtLink :to="'/landing/tienda'">
                                <NuxtImg class="image_prod" provider="bunny" :src="category.image" :width="'300px'"
                                    :quality="50" placeholder="/assets/images/panty-icon.jpg" />
                            </NuxtLink>
                            <div class="card-body">
                                <h5 class="card-title">{{ category.name }}</h5>
                                <button class="btn btn-outline-success btn-sm">Explorar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="categories-section py-5">
            <div class="container">
                <h2 class="text-center mb-5 display-4 fw-bold">Conoce Nuestra Vendedoras</h2>
                <div class="row">
                    <div class="col-md-3 my-2" v-for="seller in sellers" :key="seller.username">
                        <div class="card text-center shadow-sm overflow-hidden seller-card">
                            <NuxtLink :to="'/landing/vendedoras'">
                                <NuxtImg class="seller-image" provider="bunny" :src="seller.profilePicture"
                                    :quality="50" placeholder="/assets/images/panty-icon.jpg" width="300px" />
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
        </section>

        <!-- CTA Section -->
        <section class="cta-section text-center py-5">
            <div class="container">
                <h2 class="mb-4">¿Listo para Unirte al Movimiento?</h2>
                <p class="lead mb-4">
                    Regístrate gratis hoy y comienza a vender o comprar panties usados en una comunidad segura, anónima
                    y emocionante.
                </p>
                <button @click="ctaClick" class="btn btn-lg text-light" style="background:rgb(219, 74, 132, 0.95) !important;">Comienza Ahora</button>
            </div>
        </section>

    </div>
</template>

<script setup>

const supabase = useSupabaseClient()
const user = await supabase.auth.getUser()
const router = useRouter()
const runtimeConfig = useRuntimeConfig();
const environment = runtimeConfig.public.dev;
const baseUrl = 'https://latinpanty.com'
const userStore = useUserStore()

function ctaClick() {
    router.push('/register')
}


onMounted(async () => {

    if (user.data.user) {
        router.push('/feed')
    } else {

        if (environment === "development") {
            //console.log('no active user')
        }

    }
})

const categories = [
    { name: "Panties Usados", image: "/landing/1.jpeg" },
    { name: "Videollamadas", image: "/landing/contenido.jpg" },
    { name: "Contenido", image: "/landing/3.PNG" },
    { name: "Medias y Mallas Usadas", image: "/landing/4.jpg" },
];

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
        username: "Delfina2000",
        profilePicture: "/landing/vendedoras/8.jpg",
        age: 22,
        location: "Buenos Aires, Argentina",
        description: "Especializada en prendas íntimas usadas que te harán sentir su presencia."
    },
    {
        username: "Sammyh",
        profilePicture: "/landing/vendedoras/4.jpg",
        age: 22,
        location: "Santiago, Chile",
        description: "Acá en santiago y con ganas de vender más tangas"
    }]

useSeoMeta({
    // Basic Meta Tags
    title: 'Latin Panty | Compra y Vende Panties Usados en Latinoamérica',
    description: 'Únete al mercado #1 de panties usados en Latinoamérica. Más de 2,000,000 miembros reales compran y venden panties, medias, y contenido exclusivo. ¡Regístrate gratis y comienza hoy!',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    keywords: 'panties usados, vender panties, comprar panties, ropa interior usada, mercado latino, contenido exclusivo, medias usadas, tangas usadas, vendedoras latinas',
    author: 'Latin Panty',
    themeColor: '#ffffff',

    // Open Graph (OG) Meta Tags
    ogTitle: 'Latin Panty | Compra y Vende Panties Usados en Latinoamérica',
    ogDescription: 'Únete al mercado #1 de panties usados en Latinoamérica. Más de 2,000,000 miembros reales compran y venden panties, medias, y contenido exclusivo. ¡Regístrate gratis y comienza hoy!',
    ogImage: '/assets/images/hero-banner.jpg', // Replace with your homepage banner image
    ogUrl: `${baseUrl}`, // Replace with your website URL
    ogType: 'website',
    ogLocale: 'es_US',
    ogLocaleAlternate: [
        'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_VE', 'es_EC', 'es_GT', 'es_CU', 'es_BO', 'es_DO', 'es_HN', 'es_PY', 'es_SV', 'es_NI', 'es_CR', 'es_PR', 'es_ES', 'es_UY', 'es_PA',
    ],
    ogSiteName: 'Latin Panty',
    ogDeterminer: 'auto',

    // Twitter Meta Tags
    twitterCard: 'summary_large_image',
    twitterTitle: 'Latin Panty | Compra y Vende Panties Usados en Latinoamérica',
    twitterDescription: 'Únete al mercado #1 de panties usados en Latinoamérica. Más de 2,000,000 miembros reales compran y venden panties, medias, y contenido exclusivo. ¡Regístrate gratis y comienza hoy!',
    twitterImage: '/assets/images/hero-banner.jpg', // Replace with your homepage banner image
    twitterSite: '@latinpanty6969xxx',
    twitterCreator: '@latinpanty6969xxx',

    // Additional Meta Tags
    canonical: `${baseUrl}`, // Canonical URL for SEO
    rating: 'mature',

});

</script>

<style scoped>
.text-container {
    background: rgba(109, 109, 109, 0.603);
    border-radius: 50px;
    /*padding: 100px;*/
}

.stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;

}

.stat-item {
    text-align: center;
}

.stat-item i {
    font-size: 2rem;
    margin-bottom: 10px;
}

.features-section {
    background: #f8f9fa;
    /* Light background for contrast */
    padding: 80px 0;
}

.features-section h2 {
    font-weight: bold;
    color: #333;
    /* Darker color for better readability */
}

.features-section h3 {
    font-weight: 600;
    color: #555;
    /* Slightly lighter than the main heading */
}

.features-section ul li {
    font-size: 1.1rem;
    color: #666;
    /* Subtle text color */
}

.features-section ul li i {
    font-size: 1.2rem;
    /* Slightly larger icons */
}

.testimonials-section {
    background: #f8f9fa;
    /* Light background for contrast */
    padding: 80px 0;
}

.testimonials-section h2 {
    font-weight: bold;
    color: #333;
    /* Darker color for better readability */
}

.testimonials-section .card {
    border: none;
    transition: transform 0.3s ease;
}

.testimonials-section .card:hover {
    transform: translateY(-10px);
    /* Subtle hover effect */
}

.testimonials-section .rounded-circle {
    border: 3px solid #fff;
    /* White border around the image */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* Soft shadow */
}

.testimonials-section .card-text {
    font-size: 1rem;
    color: #555;
    /* Subtle text color */
}

.testimonials-section .text-muted {
    font-size: 0.9rem;
}

.rating {
    color: #ffc107;
}

.cta-section{
    background-color: rgba(226, 43, 156, 0.241);
}

.categories-section .card {
    border: none;
    transition: transform 0.3s ease;
}

.categories-section .card:hover {
    transform: scale(1.05);
}

.image_prod {
    max-height: 400px;
    width: auto !important;
}

@media (min-width: 991.98px) {

    .text-container {
        padding: 100px;
    }

}
</style>