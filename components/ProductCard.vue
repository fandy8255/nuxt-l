<template>

    <div class="card border-0 my-2">
        <figure class="card-img-top m-0 overflow-hidden bsb-overlay-hover">
            <NuxtLink :to="'/tienda' + prodPath">
                <img class="img-fluid bsb-scale bsb-hover-scale-up" loading="lazy" :src="imgSrc" alt="Business">
            </NuxtLink>
            <figcaption>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                    class="bi bi-eye text-white bsb-hover-fadeInLeft" viewBox="0 0 16 16">
                    <path
                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
                <h4 class="h6 text-white bsb-hover-fadeInRight mt-2">Read More</h4>
            </figcaption>
        </figure>
        <div class="card-body border bg-white p-4">
            <div class="d-flex gap-2 position-absolute" v-if='productDiscount' style="top: 10px; left: 10px;">
                <p class="discount px-3 py-1 rounded">{{ productCategory}}% descuento</p>
            </div>
            <!--
            <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">
                Fruits</div>-->
            <div class="p-xl-4 p-sm-1">
                <h4>{{ productTitle }}</h4>
                <p>{{ productDescription.length<150 ? productDescription: productDescription.slice(0,150)+ '...'}}</p>
                <p style="width: fit-content;" class="fs-bolder bg-light px-3 py-1 rounded">{{ productCategory }}</p>
                <div class="d-flex justify-content-between flex-lg-wrap">
                    <p class="text-dark fs-5 fw-bold mb-0">$ {{ productPrice }} COP</p>
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

.discount{
    background: greenyellow !important;
}
</style>