<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>



  <RouterView id="vapp" />
</template>

<style scoped>
#vapp {
  min-height: 100vh;
}
</style>
