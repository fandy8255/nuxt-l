<template>
    <div class="container-fluid mt-2">
        <div class="row w-100">

            <div class="col-sm-12 col-lg-4 mt-5 ">
                <div class="container">
                    <div style="position: relative; top: 10px; left: 10px">
                        <div class="d-flex">
                            <div class="row w-100">
                                <div class="col-6">

                                    <UserImgComponent v-if="loaded" :image="product.profile_picture"
                                        :username="product.username" />

                                </div>
                                <div class="col-6 text-end">
                                    <div class="lk d-flex justify-content-end align-items-end">
                                        <!-- {{ product && product.owner ? product.owner.id : 'loading' }} 
                                          {{ product }}
                                        {{ product.like_count }}-->

                                        <LikeButton v-if="loaded && product.user_id !== userStore.id"
                                            @click="handleClick" :likedProductId="product.id"
                                            :productOwnerId="product.user_id"
                                            :like_count="product ? parseInt(product.like_count) : 0" />
                                        <div v-else>
                                            <i class="fa-solid fa-heart"></i> {{ product.like_count }}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

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
import { onBeforeMount, ref, computed } from 'vue';

const router = useRouter()
const prodId = useRoute().params.product_id[0];
const product = ref({})
//const computedLikes=computed(()=>likes.value + 10)
const likes = ref()
const loaded = ref(false)
const userStore = useUserStore();

function handleClick() {
    likes.value = likes.value + 1
}

const fetchInfo = async (prodId) => {
    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(
            `https://lingerie.fandy8255.workers.dev/api/getProducts?product_id=${prodId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        console.log('info', result)
        product.value = result.data;
        likes.value = result.data.like_count
    } catch (error) {
        console.error(error);
        product.value = {}
    }
};

onMounted(() => {

    fetchInfo(prodId).then(res => loaded.value = true)
    console.log('producft', product)
})

/*

onBeforeMount(() => {
   

})*/

</script>

<style lang="scss" scoped></style>