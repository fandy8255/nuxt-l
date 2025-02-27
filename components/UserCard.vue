<template>
  <div class="card border-1 my-2 shadow-sm">
    <div class="card-img-top m-0 overflow-hidden bsb-overlay-hover text-center" >
      <NuxtLink :to="'/perfil/' + username">
        <NuxtImg provider="bunny" :src="profilePicture" width="300px" :quality="50"
          placeholder="/assets/images/panty-icon.jpg" />
      </NuxtLink>
    </div>
    <div class="card-body bg-white p-1 mx-1 border-top">

      <div class="d-flex gap-2 position-absolute" style="top: 10px; left: 10px;">
        <p class="category px-3 py-1 rounded">{{ ubicacion }}</p>
      </div>

      <div class="p-xl-1 p-sm-1">
        <h5>{{ username }}</h5>
        <p>{{ parseDescription(profileDescription) }}</p>

        <div class="d-flex justify-content-between flex-lg-wrap">
          <span v-if="verified" class="badge bg-success">Verificado</span>
          <span v-else class="badge bg-danger">No Verificado</span>
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>

const { username, profilePicture, profileDescription, age, verified, ubicacion } = defineProps([
  "username",
  "profilePicture",
  "profileDescription",
  "verified",
  "ubicacion"
]);

function parseDescription(profileDescription) {
  if (profileDescription) {
    if (profileDescription.length > 150) {
      return profileDescription.slice(0, 150) + '...'
    }
    else {
      return profileDescription
    }
  }
  return
}

</script>

<style scoped>
.card-body {
  border-radius: 5px;
  background: #f8f9fa;
}

.category {
  background: #ff2fe7b0 !important;
  color: white !important;
  z-index: 100 !important;
}

img{
  width: 100% !important;
}
</style>