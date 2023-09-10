<script setup>
import homeImage from '../assets/images/home.png'
import startImage from '../assets/images/startButton.png'
import HomeButton from '../components/HomeButton.vue'
import { useRouter } from "vue-router";

const router = useRouter();
const startGame = () => router.push("/modes");
</script>

<template>
  <div class="home" :style="{ backgroundImage: `url(${homeImage})`}">
    <HomeButton />
    <div class="start">
        <img class="start__img" @click="startGame" :src="startImage" alt="Botão de Iniciar">
    </div>
  </div>
</template>

<style scoped>
.home {
    height: 100vh;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  
}

.start {
    
    padding-top: 30rem;
    text-align: center;
}

.start__img {
    cursor: pointer;
}
</style>
