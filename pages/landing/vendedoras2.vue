<template>
    <div>
        <section class="container-fluid py-5">
            <div class="row my-2">
                <div class="container-xl">
                    <h2 class="text-center mb-5 display-4 fw-bold">Explora Categorías</h2>
                    <div class="row">
                        <div class="col-md-3" v-for="category in categories" :key="category.name">
                            <div class="card text-center shadow-sm overflow-hidden">
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="image_prod" provider="bunny" :src="category.image"
                                        :quality="50" placeholder="/assets/images/panty-icon.jpg" width="600px" />
                                </NuxtLink>
                                <div class="card-body">
                                    <h5 class="card-title">{{ category.name }}</h5>
                                    <button class="btn btn-outline-success btn-sm">Explorar</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="row my-2">
                <div class="container-xl">
                    <div class="row">
                        <div class="col-md-3" v-for="category in categories" :key="category.name">
                            <div class="card text-center shadow-sm overflow-hidden">
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="image_prod" provider="bunny" :src="category.image"
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
            </div>

            <div class="row my-2">
                <div class="container-xl">
                    <div class="row">
                        <div class="col-md-3" v-for="category in categories" :key="category.name">
                            <div class="card text-center shadow-sm overflow-hidden">
                                <NuxtLink :to="'/login'">
                                    <NuxtImg class="image_prod" provider="bunny" :src="category.image"
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
            </div>


        </section>
    </div>

</template>

<script setup>

const categories = [
    { name: "Tops", image: "/landing/1.jpg" },
    { name: "Bottoms", image: "/landing/2.jpg" },
    { name: "Outerwear", image: "/landing/3.jpg" },
    { name: "Accessories", image: "/landing/4.jpg" },
];


</script>

<style scoped>
.image_prod {
    max-height: 300px;
    width: auto !important;
}
</style>