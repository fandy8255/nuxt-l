<template>
    <div class="card border-0 my-2">
        <figure class="card-img-top m-0 overflow-hidden bsb-overlay-hover">
            <NuxtLink :to="'/tienda' + prodPath">
                <img class="img-fluid bsb-scale bsb-hover-scale-up" loading="lazy" :src="imgSrc" alt="Business">
            </NuxtLink>
        </figure>
        <div class="card-body border bg-white p-2">
            <div class="d-flex gap-2 position-absolute" style="top: 10px; left: 10px;">
                <p class="category px-3 py-1 rounded">{{ productCategory}}</p>
            </div>
           
            <div class="p-xl-1 p-sm-1">
                <h5>{{ productTitle }}</h5>
                <p>{{ productDescription.length<150 ? productDescription: productDescription.slice(0,150)+ '...'}}</p>
                <!--<p style="width: fit-content;" class="fs-bolder bg-light px-3 py-1 rounded">{{ productCategory }}</p>-->
                <div class="d-flex justify-content-between flex-lg-wrap">
                    <p class="text-dark fs-6 fw-bold mb-0">$ {{ productPrice }} COP</p>
                    <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary">
                        <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                    
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

const { imgSrc, productTitle, productDescription, prodPath, productCategory,productPrice } = 
defineProps(['imgSrc', 'productTitle', 'productDescription', 'prodPath', 'productCategory','productPrice'])
//const { } = defineProps(['articleDescription'])

console.log('testing')

</script>

<style scoped>

.category{
    background: #2f40ffb0 !important;
    z-index: 100 !important;
}
</style>