<template>
    <div>
        <SimpleHero />
        <Stats />

        <!-- Categories Section -->
        <section class="categories-section py-5">
            <div class="container">
                <h2 class="text-center mb-4">Browse Categories</h2>
                <div class="row">
                    <div class="col-md-3" v-for="category in categories" :key="category.name">
                        <div class="card text-center shadow-sm overflow-hidden">
                            <NuxtLink :to="'/login'">
                                <NuxtImg class="image_prod" provider="bunny" :src="category.image" :width="'300px'"
                                    :quality="50" placeholder="/assets/images/panty-icon.jpg" />
                            </NuxtLink>
                            <div class="card-body">
                                <h5 class="card-title">{{ category.name }}</h5>
                                <button class="btn btn-outline-success btn-sm">Explore</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <FeaturedItems />

        <!-- CTA Section -->
        <section class="cta-section text-center py-5">
            <div class="container">
                <h2 class="mb-4">Join the Movement</h2>
                <p class="lead">Clean out your closet or discover treasures in ours. Every item makes a difference!</p>
                <button class="btn btn-success btn-lg">Donate Clothes</button>
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


onMounted(async () => {

    if (user.data.user) {
        router.push('/feed')
    } else {

        if (environment === "development") {
            console.log('no active user')
        }

    }
})


useSeoMeta({
    title: 'Latin Panty | Compra panties usados',
    ogTitle: 'Latin Panty | Compra panties usados',
    description: 'Compra y venta de panties usados de Latinas',
    ogDescription: 'Compra y venta de panties usados de Latinas',
    ogImage: '',
    twitterCard: '',
})

const categories = [
    { name: "Tops", image: "/landing/1.jpg" },
    { name: "Bottoms", image: "/landing/2.jpg" },
    { name: "Outerwear", image: "/landing/3.jpg" },
    { name: "Accessories", image: "/landing/4.jpg" },
];

const featuredItems = [
    { name: "Vintage Denim Jacket", image: "/images/featured/jacket.jpg", price: 40 },
    { name: "Floral Summer Dress", image: "/images/featured/dress.jpg", price: 25 },
    { name: "Leather Handbag", image: "/images/featured/handbag.jpg", price: 60 }]

</script>

<style scoped>

.image_prod {
    /*max-height: 600px;*/
    max-height: 400px;
    width: auto !important;
   /* width: 300px !important;*/
}

.hero-section {
    background: linear-gradient(to bottom right, #85c79e, #a1eecf);
    color: white;
}

.categories-section .card {
    border: none;
    transition: transform 0.3s ease;
}

.categories-section .card:hover {
    transform: scale(1.05);
}

.featured-items-section .card {
    border: none;
    transition: box-shadow 0.3s ease;
}

.featured-items-section .card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cta-section {
    background: linear-gradient(to bottom right, #fbcf88, #f7e9a5);
}

.footer-section {
    font-size: 0.9rem;
}
</style>