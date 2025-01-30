<template>
    <div class="card border-1 my-2 shadow-sm">
        <div class="card-head">
            <UserImgComponent :image="message.profile_picture" :username="message.username" />
        </div>
        <div class="card-body">
            <p> {{ message.content }}</p>
        </div>
    </div>
</template>

<script setup>
const { product, isAd } =
    defineProps(['message'])

</script>

<style scoped></style>