<template>
    <div class="card border-1 my-2 shadow-sm">
        <div class="card-img-top m-0 overflow-hidden bsb-overlay-hover text-center" style="max-height: 40vh !important">
            <NuxtLink :to="'/tienda/' + prodId">
                <!--<img class="img-fluid bsb-scale bsb-hover-scale-up" loading="lazy" :src="imgSrc" alt="Business">-->
                <NuxtImg provider="bunny" :src="imgSrc" width="300px" :quality="50" placeholder="/assets/images/panty-icon.jpg" />
            </NuxtLink>
        </div>
        <div class="card-body bg-white p-1 mx-1 border-top">
            <UserImgComponent :image="usernamePicture" :username="username" ></UserImgComponent>
            <div class="d-flex gap-2 position-absolute" style="top: 10px; left: 10px;">
                <p class="category px-3 py-1 rounded">{{ productCategory}}</p>
            </div>
           
            <div class="p-xl-1 p-sm-1">
                <h5>{{ productTitle }}</h5>
                <p>{{ productDescription.length<150 ? productDescription: productDescription.slice(0,150)+ '...'}}</p>
                <!--<p style="width: fit-content;" class="fs-bolder bg-light px-3 py-1 rounded">{{ productCategory }}</p>-->
                <div class="d-flex justify-content-between flex-lg-wrap">
                    <p id="price" class="text-dark fs-6 fw-bold mb-0">$ {{ productPrice }} COP</p>
                   <DeleteProductModal :product="product" :productId="prodId" v-if="userStore.username===username" @updateProductsStore="updateProducts" @click="test" />
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

const {product, username, usernamePicture, imgSrc, productTitle, productDescription, prodId, productCategory,productPrice } = 
defineProps(['product', 'username', 'usernamePicture', 'imgSrc', 'productTitle', 'productDescription', 'prodId', 'productCategory','productPrice'])
const userStore = useUserStore();
/*const username= useRoute().params?.username[0]*/
const emit = defineEmits(['updateProductsStore2'])

function test(){
    console.log(prodId)
}

function updateProducts(){
    emit('updateProductsStore2')
}


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