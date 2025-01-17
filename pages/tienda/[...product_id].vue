<template>
    <div class="container-fluid mt-2">
        <div class="row w-100">

            <div class="col-sm-12 col-lg-4 ">
                <div class="container">
                    <div style="position: relative; top: 10px; left: 10px">
                        <UserImgComponent v-if="product && product.owner" :image="product.owner.profile_picture" :username="product.owner.username" />
                       <!-- {{ product && product.owner ? product.owner.profile_picture : 'none' }}-->
                        <h2 class="mt-4">{{ product.product_name }}</h2>
                        <p>{{ product.product_description }}</p>
                        <p>{{ product.product_category }}</p>
                        <div class="rating mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                            <span>(4.0)</span>
                        </div>
                        <div>
                            Payment
                        </div>
                        <div class="container">
                            Some more info

                        </div>
                    </div>

                </div>

            </div>

            <div class="col-sm-12 col-lg-8 p-2 mt-5">
                <SplideComponent :images="product.images" />
            </div>

        </div>
        <div class="row">
            Comments
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';

const router = useRouter()
const prodId = useRoute().params.product_id[0];
const runtimeConfig = useRuntimeConfig();
const product = ref({})

const fetchInfo = async (prodId) => {
    try {
        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/getProducts?product_id=${prodId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        console.log('info', result)
        product.value = result.data;
    } catch (error) {
        console.error(error);
        product.value={}
        //product.value = null
        //user.value = null;
    }
};

onBeforeMount( () => {
    console.log('prodId', prodId)
    //fetchProduct(prodId)
    fetchInfo(prodId)

})

</script>

<style lang="scss" scoped></style>