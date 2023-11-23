<script setup>
import Scenarios from './components/Scenarios.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <section class="main d-flex align-items-center justify-content-center">
    <Scenarios />
    <NavBar />
  </section>
</template>

<style scoped lang="scss">
.main {
  padding: 12.8rem 2.4rem 10rem 2.4rem;
  @media (max-width: 480px) {
    padding: 3.2rem 2.4rem;
  }
}
</style>
