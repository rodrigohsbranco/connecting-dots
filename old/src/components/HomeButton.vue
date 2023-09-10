<script setup>
import homeImage from '../assets/images/homeButton.png'
</script>

<template>
  <div class="homeButton">
    <img @click="startGame" class="homeButton__img" :src="homeImage" alt="Botão para voltar à tela inicial">
  </div>
</template>

<style scoped>
.homeButton {
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.homeButton__img {
  cursor: pointer;
}
</style>
