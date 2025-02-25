<template>
    <div>
        <section class="hero-section text-center py-5">
            <div class="container">
                <h1 class="display-4 mb-4">World's #1 Marketplace for Used Panties</h1>
                <p class="lead mb-4">
                    Selling used underwear is a great way to turn your panties into cash. Join over 2,000,000 real
                    members in the largest marketplace for buying and selling worn panties.
                </p>
                <div class="stats d-flex justify-content-center gap-4 mb-5">
                    <div class="stat-item">
                        <i class="bi bi-people-fill"></i>
                        <h3>1,468,444</h3>
                        <p>Panty Sellers</p>
                    </div>
                    <div class="stat-item">
                        <i class="bi bi-person-plus-fill"></i>
                        <h3>1,854,140</h3>
                        <p>Panty Buyers</p>
                    </div>
                    <div class="stat-item">
                        <i class="bi bi-camera-reels-fill"></i>
                        <h3>855,612</h3>
                        <p>Media Files</p>
                    </div>
                    <div class="stat-item">
                        <i class="bi bi-cash-coin"></i>
                        <h3>883,569</h3>
                        <p>Private Deals</p>
                    </div>
                </div>
                <button class="btn btn-success btn-lg">Sign Up for Free</button>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section py-5">
            <div class="container">
                <h2 class="text-center mb-5">Why Choose Us?</h2>
                <div class="row">
                    <div class="col-md-6">
                        <h3>For Sellers</h3>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle-fill"></i> Safe and Anonymous</li>
                            <li><i class="bi bi-check-circle-fill"></i> Own Shop System</li>
                            <li><i class="bi bi-check-circle-fill"></i> Set Your Own Prices</li>
                            <li><i class="bi bi-check-circle-fill"></i> No Transaction Fees</li>
                            <li><i class="bi bi-check-circle-fill"></i> New Buyers Daily</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h3>For Buyers</h3>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle-fill"></i> Messages & Chat</li>
                            <li><i class="bi bi-check-circle-fill"></i> Classified Ad Market</li>
                            <li><i class="bi bi-check-circle-fill"></i> User Ranking List</li>
                            <li><i class="bi bi-check-circle-fill"></i> Member Reviews</li>
                            <li><i class="bi bi-check-circle-fill"></i> Privacy Functions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="testimonials-section py-5 bg-light">
            <div class="container">
                <h2 class="text-center mb-5">What Our Members Say</h2>
                <div class="row">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                </div>
                                <p class="card-text">
                                    "Pantydeal was curiosity turned full-time fun for me! I had no idea it would turn
                                    out to be what it is. 6 short months, many sold items later, and I made the top 25
                                    sellers list!"
                                </p>
                                <p class="text-muted">- BlondeMI (28 Years)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                </div>
                                <p class="card-text">
                                    "Pantydeal is so much fun! It's a safe place to explore - without judgment! As one
                                    of the top sellers, I love getting creative and making my customers happy."
                                </p>
                                <p class="text-muted">- Michelle (29 Years)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="rating mb-3">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                </div>
                                <p class="card-text">
                                    "From panties to socks and anything you can think of. Everything about this site is
                                    professional and easy to use!"
                                </p>
                                <p class="text-muted">- Totti (25 Years)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section text-center py-5">
            <div class="container">
                <h2 class="mb-4">Ready to Join the Movement?</h2>
                <p class="lead mb-4">
                    Sign up for free today and start selling or buying used panties in a safe, anonymous, and exciting
                    community.
                </p>
                <button class="btn btn-success btn-lg">Get Started Now</button>
            </div>
        </section>
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

.hero-section {
    background: linear-gradient(to bottom right, #ff7eb9, #ff758c);
    color: white;
    padding: 100px 0;
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
    background: white;
    padding: 80px 0;
}

.features-section ul {
    list-style: none;
    padding-left: 0;
}

.features-section li {
    margin-bottom: 10px;
}

.testimonials-section {
    padding: 80px 0;
}

.testimonials-section .card {
    border: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rating {
    color: #ffc107;
}

.cta-section {
    background: linear-gradient(to bottom right, #85c79e, #a1eecf);
    color: white;
    padding: 100px 0;
}
</style>