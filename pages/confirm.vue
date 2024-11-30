<script setup lang="ts">
const user = useSupabaseUser()

/*
watch(user, () => {
  if (user.value) {
      // Redirect to protected page
      return navigateTo('/login')
  }
}, { immediate: true })
*/

</script>

<template>
  <div>
    <h1>confirmation page</h1>
    <div>Waiting for login...</div>
  </div>
</template>