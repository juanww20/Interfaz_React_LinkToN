<template>
  <div class="loader-overlay">
    <div class="tangram-loader">
      <Tangram />
    </div>
  </div>
</template>

<script setup>
import Tangram from './ComponenteTangram.vue';
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* Fondo semi-transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.tangram-loader {
  /* Puedes agregar animaciones aquí si lo deseas */
}
</style>
