<script setup>
defineProps(['type'])
</script>

<template>
  <div :class="[type]">
    <p> hey there </p>
    <!--<slot mdc-unwrap="p" />-->
  </div>
</template>