<template>
    <div>
        <div v-if="product">
            <div class="product_card card border-1 my-2 shadow-sm">

                <div class="card-img-top m-0 overflow-hidden bsb-overlay-hover text-center">
                    <NuxtLink :to="'/tienda/' + product.id">
                        <NuxtImg class="image_prod" provider="bunny" :src="product.product_url" :width="width"
                            :quality="50" placeholder="/assets/images/panty-icon.jpg" />
                    </NuxtLink>
                </div>
                <div class="card-body bg-white p-1 mx-1 border-top">
                    <div class="d-flex">
                        <div class="row w-100">
                            <div class="col-6">
                                <UserImgComponent :image="product.profile_picture" :username="product.username" />
                            </div>
                            <div class="col-6 text-end">
                                <div class="lk d-flex justify-content-end align-items-end">
                                   <!--{{ product }}-->
                                    <LikeButton v-if="product.user_id !== userStore.id" :likedProductId="product.id"
                                        :productOwnerId="product.user_id" :like_count="product.like_count" :productName="product.product_name" :productUrl="product.product_url" />
                                    <div v-else>
                                        <i class="fa-solid fa-heart"></i> {{ product.like_count }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex gap-2 position-absolute" style="top: 10px; left: 10px;">
                        <p class="category px-3 py-1 rounded">{{ product.product_category }}</p>
                    </div>

                    <div class="p-xl-1 p-sm-1">
                        <h5>{{ product.product_name }}</h5>

                        <p>{{ product.product_description.length < 150 ? product.product_description :
                            product.product_description.slice(0, 150) + '...' }}</p>
                                <div class="d-flex justify-content-between flex-lg-wrap">
                                    <!-- <p id="price" class="text-dark fs-6 fw-bold mb-0">Stock: {{ product.product_stock }}</p>-->
                                    <p id="price" class="text-dark fs-6 fw-bold mb-0">$ {{ product.product_price }} {{ product.product_currency.toUpperCase() }}</p>
                                    <DeleteProductModal :productId="product.id"
                                        v-if="userStore.username === product.username || isAd"
                                        @updateProductsStore="updateProducts" />
                                    <div v-else>
                                        <ReportModal :productId="product.id" :reporterId="userStore.id"
                                            :reportedId="product.user_id" />
                                    </div>
                                </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>

const { product, isAd, width } = defineProps(['product', 'isAd', 'width'])
const userStore = useUserStore();

const emit = defineEmits(['updateProductsStore2'])

function updateProducts() {
    emit('updateProductsStore2')
}

const isReportModalOpen = ref(false);
const selectedProductId = ref(null);
const selectedReportedId = ref(null);

const openModal = (productId, reportedId) => {
    selectedProductId.value = productId;
    selectedReportedId.value = reportedId;
    isReportModalOpen.value = true;
};

</script>

<style scoped>
.category {
    background: #ff2fe7b0 !important;
    color: white !important;
    z-index: 100 !important;
}

img {
    width: 100% !important;
}

#price {
    color: rgb(84, 84, 84) !important;
}
</style>