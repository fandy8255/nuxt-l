<template>
    <div class="message-card card border-1 my-2 shadow-sm p-0">
        <div class="card-head p-2">
            <UserImgComponent :image="message.profile_picture" :username="message.username" ms-5 />
        </div>
        <div class="card-body">
            <p>{{ message.content }}</p>
            
        </div>
        <div class="card-footer">
            <small>{{ new Date(message.created_at).toLocaleString() }}</small>
        </div>
    </div>
</template>

<script setup>
const { product, isAd } =
    defineProps(['message'])

</script>

<style scoped></style>