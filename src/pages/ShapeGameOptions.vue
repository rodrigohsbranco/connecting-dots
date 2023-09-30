<script setup>
import { ref } from "vue";
import ShapeGameOptionsbg from "../assets/images/shapeGameOptionsBg.png";
import BackButton from "../components/BackButton.vue"
import ShapesTitle from "../assets/images/shapesTitle.png";

import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";

import background from "../assets/images/home.jpg";
import cloud1 from "../assets/images/cloud1.png";
import cloud2 from "../assets/images/cloud2.png";
import cloud3 from "../assets/images/cloud3.png";
import cloud4 from "../assets/images/cloud4.png";
import cloud5 from "../assets/images/cloud5.png";
import cloud6 from "../assets/images/cloud6.png";
import cloud7 from "../assets/images/cloud7.png";
import cloud8 from "../assets/images/cloud8.png";
import cloud9 from "../assets/images/cloud9.png";
import cloud10 from "../assets/images/cloud10.png";
import { useRouter } from "vue-router";

const router = useRouter();
const pageRoute = ref("/GameModes");

const startGame = (shapeGame) => router.push(`${shapeGame}`);
</script>

<template>
  <div class="shape">
    <img :src="background" class="img-background" alt="background">
    <BackButton :name="pageRoute" />
    <!-- <HomeButton /> -->
    <img :src="ShapesTitle" alt="shapes title" class="shapes-title">

    <img
      :src="butterBig"
      class="butter big"
      alt="butterfly">
    <img
      :src="butterSmall"
      class='butter big'
      id="butter-big"
      alt="butterfly">

    <div class="shape__clouds-1">
      <img
        @click="startGame('/ShapeGameSquare')"
        class="shape__cloud"
        :src="cloud1"
        alt="Desafio 1 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameTriangle')"
        class="shape__cloud"
        :src="cloud2"
        alt="Desafio 2 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameCircle')"
        class="shape__cloud"
        :src="cloud3"
        alt="Desafio 3 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameTrapeze')"
        class="shape__cloud"
        :src="cloud4"
        alt="Desafio 4 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGamePentagon')"
        class="shape__cloud"
        :src="cloud5"
        alt="Desafio 5 do jogo de ligar pontos com formas."
      />

      <img
        @click="startGame('/ShapeGameEllipse')"
        class="shape__cloud"
        :src="cloud6"
        alt="Desafio 6 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameHeptagon')"
        class="shape__cloud"
        :src="cloud7"
        alt="Desafio 7 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameRectangle')"
        class="shape__cloud"
        :src="cloud8"
        alt="Desafio 8 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameHexagon')"
        class="shape__cloud"
        :src="cloud9"
        alt="Desafio 9 do jogo de ligar pontos com formas."
      />
      <img
        @click="startGame('/ShapeGameStar')"
        class="shape__cloud"
        :src="cloud10"
        alt="Desafio 10 do jogo de ligar pontos com formas."
      />
    </div>
  </div>
</template>

<style scoped>
.shape {
  height: 100vh;
}

.img-background {
  position:fixed;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  object-fit:cover;
  width:100vw;
  height:100vh;
  animation:floating-effect 3s linear alternate infinite;
}

.shapes-title {
  position:absolute;
  top:.5rem;
  left: 50%;
  transform: translateX(-50%);
  width:16rem;
  animation:just-appear .7s linear forwards;
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

.butter {
  position:absolute;
}

.butter.big {
  right:3rem;
  top:5rem;
  width:7rem;
  animation:butterfly-flap 7s ease-in-out infinite, just-appear .7s linear forwards;
}

#butter-big {
  top:25rem;
  width:6rem;
  left:8rem;
  animation:butterfly-flap 4s ease-in-out infinite, just-appear .7s linear forwards;  
}

.butter.small:nth-child(2) {
  width:4rem;
}

@keyframes butterfly-flap {
  0%, 100% {
    transform: translate(0px, 0px) rotateX(0) rotateY(0) rotate(10deg);
  }

  50% {
    transform: translate(5px, 14px) rotateX(3deg) rotateY(3deg) rotate(10deg);
  }
}

.shape__clouds-1 {
  position:absolute;
  justify-content:center;
  flex-wrap:wrap;
  width:60rem;
  display:flex;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  gap:2rem;
}

.shape__cloud {
  cursor: pointer;
  animation:zoom .4s linear forwards;
}

@keyframes zoom {
  from {
    transform:scale(.3);
    opacity:0;
  }

  to {
    transform:scale(1);
    opacity:1;
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

@media (max-width:900px) {
  .shapes-title {
    top:1rem;
    width:13rem;
  }
  .shape__clouds-1 {
    width:95vw;
    gap:1.2rem;
  }

  .shape__cloud {
    width:calc(20% - 1.2rem);
  }
}
</style>
