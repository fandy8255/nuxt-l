<template>
    <div class="card border-1 my-2">
        <div class="card-img-top m-0 overflow-hidden bsb-overlay-hover text-center" style="max-height: 40vh !important">
            <NuxtLink :to="'/tienda/' + prodId">
                <!--<img class="img-fluid bsb-scale bsb-hover-scale-up" loading="lazy" :src="imgSrc" alt="Business">-->
                <NuxtImg provider="bunny" :src="imgSrc" width="300px" :quality="50" placeholder="/assets/images/panty-icon.jpg" />
            </NuxtLink>
        </div>
        <div class="card-body bg-white p-1 mx-1 border-top">
            <div class="d-flex gap-2 position-absolute" style="top: 10px; left: 10px;">
                <p class="category px-3 py-1 rounded">{{ productCategory}}</p>
            </div>
           
            <div class="p-xl-1 p-sm-1">
                <h5>{{ productTitle }}</h5>
                <p>{{ productDescription.length<150 ? productDescription: productDescription.slice(0,150)+ '...'}}</p>
                <!--<p style="width: fit-content;" class="fs-bolder bg-light px-3 py-1 rounded">{{ productCategory }}</p>-->
                <div class="d-flex justify-content-between flex-lg-wrap">
                    <p id="price" class="text-dark fs-6 fw-bold mb-0">$ {{ productPrice }} COP</p>
                    <!--
                    <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary bg-light d-flex">
                        <i class="fa fa-shopping-bag me-2 text-primary"></i> 
                         <p class="fs-bold">Ver</p>
                     </a>
                     -->
                    
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

const { imgSrc, productTitle, productDescription, prodId, productCategory,productPrice } = 
defineProps(['imgSrc', 'productTitle', 'productDescription', 'prodId', 'productCategory','productPrice'])
//const { } = defineProps(['articleDescription'])

console.log('testing')

</script>

<style scoped>

.category{
    background: #ff2fe7b0 !important;
    color: white !important;
    z-index: 100 !important;
}
.card-body{
    /*background: linear-gradient(rgba(255, 0, 230, 0.633), rgba(255, 0, 242, 0.107));*/
}

#price{
    color: rgb(84, 84, 84)!important;
}
</style>