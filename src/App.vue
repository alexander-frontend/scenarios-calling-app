<script setup>
import ScenariosList from './components/ScenariosList.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <section class="main d-flex justify-content-center">
    <ScenariosList />
    <NavBar />
  </section>
</template>

<style scoped lang="scss">
.main {
  position: relative;
  height: 100%;
  padding: 12.8rem 2.4rem 10rem 2.4rem;
  @media (orientation: landscape) and (max-width: 968px), (max-width: 480px) {
    padding: 3.2rem 2.4rem;
  }
}
</style>
