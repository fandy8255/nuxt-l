<template>
	<div v-for="(product, index) in products" :key="index" class="col">
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">{{ product.product_name }}</h5>
                <!--<p class="card-text">{{ product.comment }}</p> -->
            </div>
        </div>
	</div>
</template>

<script setup>

const products = ref([])

const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        let parsed= await response.json()
        products.value=parsed.data.results

</script>