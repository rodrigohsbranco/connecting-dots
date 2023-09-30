<script setup>
import homeImage from "../assets/images/home.jpg";
import dots from "../assets/images/dots.png";
import startImage from "../assets/images/startButton.png";

import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";

import HomeButton from "../components/HomeButton.vue";
import { useRouter } from "vue-router";

import { ref } from "vue";

const router = useRouter();
const startGame = () => router.push("/GameModes");

const isParallax = ref(true),
      showButton = ref(false)

const handleAnimationEnd = () => {
  if (isParallax.value) {
    isParallax.value = false;
  }
}

const handleShowButton = () => {
  if (!showButton.value) {
    showButton.value = true
  }
}
</script>

<template>
  <div class="home">
    <img 
      :src="homeImage" 
      :class="{ 'img-background': isParallax, 'img-background floating': !isParallax }"
      @animationend="handleAnimationEnd"
      alt="Descrição da imagem">

    <!-- <HomeButton /> -->

    <section class="start">
      <img 
        :src="dots" 
        alt="liga pontos"
        @animationend="handleShowButton"
        :class="{ 'conec-dots': isParallax, 'conec-dots active': !isParallax }">

      <div
        :class="{ 'container-butter': !showButton, 'container-butter active': showButton }">

        <img
          :src="butterBig"
          class="butter big"
          alt="butterfly">
        <img
          :src="butterBig"
          class='butter big'
          id="butter-big"
          alt="butterfly">
        <img
          :src="butterSmall"
          class="butter small"
          alt="butterfly">
        <img
          :src="butterSmall"
          class='butter small'
          id="butter-small"
          alt="butterfly">
      </div>

      <img
        :class="{ 'start__img': !showButton, 'start__img active': showButton }"
        @click="startGame"
        :src="startImage"
        alt="Botão de Iniciar"
      />
    </section>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  width:100vw;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.conec-dots {
  width:36rem;
  opacity:0;
}

.conec-dots.active {
  animation:zoom .7s linear forwards;
}

.img-background {
  position:fixed;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  object-fit:cover;
  width:200vw;
  height:200vh;
  animation:parallax-effect 1.1s linear forwards;
}

.img-background.floating {
  animation:floating-effect 3s linear alternate infinite;
}

.start {
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  display:grid;
  place-items:center;
  gap:2rem;
}

.start__img {
  opacity:0;
  pointer-events:none;
}

.start__img.active {
  pointer-events:all;
  cursor: pointer;
  animation:just-appear .8s linear forwards;
}

.container-butter {
  opacity:0;
}

.container-butter.active {
  animation:just-appear .7s linear forwards;
}

.butter {
  position:absolute;
}

.butter.big {
  right:-17rem;
  top:2rem;
  width:9rem;
  animation:butterfly-flap 7s ease-in-out infinite;
}

#butter-big {
  top:25rem;
  width:6rem;
  left:-8rem;
  animation:butterfly-flap 4s ease-in-out infinite;  
}
.butter.small {
  width:5rem;
  left:40rem;
  top:24rem;
  animation:butterfly-flap 6s ease-in-out infinite; 
}

#butter-small {
  width:7.5rem;
  left:-15rem;
  top:6rem;
  animation:butterfly-flap 5s ease-in-out infinite; 
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

@keyframes parallax-effect {
  from {
    width:200vw;
    height:200vh;
  }

  to {
    width:100vw;
    height:100vh;
  }
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

@keyframes zoom {
  from {
    transform:scale(.1);
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
</style>
