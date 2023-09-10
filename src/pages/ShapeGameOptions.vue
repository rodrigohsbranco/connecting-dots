<script setup>
import { ref } from 'vue';
import ShapeGameOptionsbg from '../assets/images/shapeGameOptionsBg.png';
import BackButton from '../components/BackButton.vue';
import HomeButton from '../components/HomeButton.vue';
import cloud1 from '../assets/images/cloud1.png';
import cloud2 from '../assets/images/cloud2.png';
import cloud3 from '../assets/images/cloud3.png';
import cloud4 from '../assets/images/cloud4.png';
import cloud5 from '../assets/images/cloud5.png';
import cloud6 from '../assets/images/cloud6.png';
import cloud7 from '../assets/images/cloud7.png';
import cloud8 from '../assets/images/cloud8.png';
import cloud9 from '../assets/images/cloud9.png';
import cloud10 from '../assets/images/cloud10.png';
import { useRouter } from "vue-router";

const router = useRouter();
const pageRoute = ref('/GameModes');

const startGame = (shapeGame)  => router.push(`${shapeGame}`);

</script>

<template>
  <div class="shape" :style="{ backgroundImage: `url(${ShapeGameOptionsbg})`}">
    <BackButton :name="pageRoute" />
    <HomeButton />
    <div class="shape__clouds-1">
        <img @click="startGame('/ShapeGameSquare')" class="shape__cloud" :src="cloud1" alt="Desafio 1 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameTriangle')" class="shape__cloud" :src="cloud2" alt="Desafio 2 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameCircle')" class="shape__cloud" :src="cloud3" alt="Desafio 3 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameTrapeze')" class="shape__cloud" :src="cloud4" alt="Desafio 4 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGamePentagon')" class="shape__cloud" :src="cloud5" alt="Desafio 5 do jogo de ligar pontos com formas.">
    </div>
    <div class="shape__clouds-2">
        <img @click="startGame('/ShapeGameEllipse')" class="shape__cloud" :src="cloud6" alt="Desafio 6 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameHeptagon')" class="shape__cloud" :src="cloud7" alt="Desafio 7 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameRectangle')" class="shape__cloud" :src="cloud8" alt="Desafio 8 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameHexagon')" class="shape__cloud" :src="cloud9" alt="Desafio 9 do jogo de ligar pontos com formas.">
        <img @click="startGame('/ShapeGameStar')" class="shape__cloud" :src="cloud10" alt="Desafio 10 do jogo de ligar pontos com formas.">
    </div>
  </div>
</template>

<style scoped>
.shape {
    height: 100vh;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover; 
}

.shape__clouds-1 {
    display: flex;
    justify-content: space-around;
    padding: 14rem 11rem 0 11rem;
}

.shape__clouds-2 {
    display: flex;
    justify-content: space-around;
    padding: 3rem 11rem 0 11rem;
}

.shape__cloud {
    cursor: pointer;
}
</style>
