<script setup>
import { ref } from 'vue';
import modesBg from '../assets/images/modesBg.png';
import BackButton from '../components/BackButton.vue';
import HomeButton from '../components/HomeButton.vue';
import pictureShapes from '../assets/images/pictureShapes.png';
import animalPicture from '../assets/images/animalPicture.png';
import { useRouter } from "vue-router";

const pageRoute = ref('/');
const router = useRouter();

const goToShapeGameOptions = () => router.push("/shape");

</script>

<template>
  <div class="modes" :style="{ backgroundImage: `url(${modesBg})`}">
    <BackButton :name="pageRoute" />
    <HomeButton />
    <div class="modes__games">
        <img @click="goToShapeGameOptions" class="modes__games-shapes" :src="pictureShapes" alt="Acesso ao jogo de ligar pontos com formas geométricas">
        <img class="modes__games-animal" :src="animalPicture" alt="Acesso ao jogo de ligar pontos com traçados">
    </div>
  </div>
</template>

<style scoped>
.modes {
    height: 100vh;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover; 
}

.modes__games {
    display: flex;
    justify-content: space-around;
    padding: 11rem 10rem 0 10rem;
}

.modes__games-shapes,
.modes__games-animal {
    cursor: pointer;
}
</style>
