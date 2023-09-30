<script setup>
import { ref } from "vue";
import modesBg from "../assets/images/modesBg.png";
import BackButton from "../components/BackButton.vue";
import HomeButton from "../components/HomeButton.vue";

import pictureShapes from "../assets/images/pictureShapes.png";
import animalPicture from "../assets/images/animalPicture.png";

import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";

import { useRouter } from "vue-router";

const pageRoute = ref("/");
const router = useRouter();

const goToShapeGameOptions = () => router.push("/ShapeGameOptions");
</script>

<template>
  <div class="modes">
    <img :src="modesBg" alt="background" class='img-background'>
    <BackButton :name="pageRoute" />
    <!-- <HomeButton /> -->
    <div class="modes__games">
      <div class="container">
        <div class="star star1"></div>
        <div class="star star2"></div>
        <div class="star star3"></div>
        <div class="star star1"></div>
        <div class="star star2"></div>
        <div class="star star3"></div>
        <div class="star star1"></div>
        <div class="star star2"></div>
        <div class="star star3"></div>
      </div>
      
      <img
        :src="butterBig"
        class="butter big"
        alt="butterfly">
      <img
        :src="butterSmall"
        class='butter small'
        id="butter-small"
        alt="butterfly">

      <img
        @click="goToShapeGameOptions"
        class="modes__games-shapes"
        :src="pictureShapes"
        alt="Acesso ao jogo de ligar pontos com formas geométricas"
      />
      <img
        class="modes__games-animal"
        :src="animalPicture"
        alt="Acesso ao jogo de ligar pontos com traçados"
      />
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

.img-background {
  position:fixed;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  object-fit:cover;
  animation:floating-effect 4s linear alternate infinite;
}

@keyframes floating-effect {
  from {
    width:100vw;
    height:100vh;
  }

  to {
    width:100vw;
    height:105vh;
  }
}

@keyframes just-appear {
  from {
    opacity:0;
  }

  to {
    opacity:1;
  }
}

.modes__games {
  display: flex;
  z-index:2000;
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  justify-content:center;
  gap:15rem;
  animation:just-appear .7s linear forwards;
}

.modes__games-shapes,
.modes__games-animal {
  cursor: pointer;
}

.butter {
  position:absolute;
}

.butter.big {
  left:17rem;
  top:-5rem;
  width:9rem;
  animation:butterfly-flap 7s ease-in-out infinite;
}

.butter.small {
  width:5rem;
  left:15rem;
  top:21rem;
  animation:butterfly-flap 6s ease-in-out infinite; 
}

.butter.small:nth-child(2) {
  width:4rem;
}

@keyframes butterfly-flap {
  0%, 100% {
    transform: translate(0px, 0px) rotateX(0) rotateY(0) rotate(20deg);
  }

  50% {
    transform: translate(5px, 14px) rotateX(3deg) rotateY(3deg) rotate(20deg);
  }
}

.container {
  margin-left:-31rem;
  top:6.5rem;
  position: absolute;
  width: 200px;
  height: 140px;
  transform:rotate(-4deg);
  pointer-events:none;
}

.star {
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: transparent;
    clip-path: polygon(
        38% 35%,
        51% 0%,
        62% 36%,
        100% 48%,
        61% 60%,
        48% 100%,
        37% 59%,
        0% 47%
    );
    animation: blink 2s infinite;
}

.star:nth-child(1) {
    top: 30%;
    left: 20%;
    background-color: rgba(255, 255, 255, 1);
}

.star:nth-child(2) {
    top: 60%;
    left: 70%;
    background-color: rgba(35, 181, 211, 1);
}

.star:nth-child(3) {
    top: 10%;
    left: 50%;
    background-color: rgba(243, 202, 64, 1);
}

.star:nth-child(4) {
    top: 70%;
    left: 40%;
    background-color: rgba(255, 255, 255, 1);
}

.star:nth-child(5) {
    top: 40%;
    left: 10%;
    background-color: rgba(35, 181, 211, 1);
}

.star:nth-child(6) {
    top: 80%;
    left: 80%;
    background-color: rgba(243, 202, 64, 1);
}

.star:nth-child(7) {
    top: 20%;
    left: 60%;
    background-color: rgba(255, 0, 0, 1);
}

.star:nth-child(8) {
    top: 50%;
    left: 30%;
    background-color: rgba(0, 255, 0, 1);
}

.star:nth-child(9) {
    top: 90%;
    left: 20%;
    background-color: rgba(0, 0, 255, 1);
}

@keyframes blink {
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

@media (max-width:800px) {
  .modes__games {
    justify-content:space-between;
    gap:0rem;
    width:95vw;
  }
}
</style>
