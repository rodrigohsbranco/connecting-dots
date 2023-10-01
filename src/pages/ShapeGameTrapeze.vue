<script setup>
import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";

import ConfettiExplosion from 'vue-confetti-explosion'

import trapezePicture from "../assets/images/trapezePicture.png";
import veryGoodImg from "../assets/images/veryGoodImg.png";
import nextButton from "../assets/images/nextButton.png";
import arrow from "../assets/images/0-arrow.png";

import { onMounted, ref } from "vue";
import shapeGameBg from "../assets/images/shapeGameBg.png";
import numberTrapeze from "../assets/images/numbers/2-trapeze.png";
import BackButton from "../components/BackButton.vue";
import HomeButton from "../components/HomeButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const pageRoute = ref("/ShapeGameOptions");

const nextShape = (next) => router.push(`${next}`);

let dots = [];
let guideDots = [];
let currentIndex = 0;
let drawingCompleted = false;

let explosion = ref(false);
let lastPos = { x: 100, y: 160 };
let currentPos = { x: 100, y: 160 };
let dotSize = 9;

class Dot {
  constructor(x, y, strokeColor) {
    this.x = x;
    this.y = y;
    this.strokeColor = strokeColor;
  }
  connect(px, py, ctx) {
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 10; // Especifique a largura da linha aqui
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
  plot(ctx) {
    ctx.fillStyle = "rgb(226, 126, 110)";
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 3; // Especifique a largura da borda aqui
    ctx.beginPath();
    ctx.arc(this.x, this.y, dotSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  within(px, py) {
    let d = Math.sqrt(Math.pow(px - this.x, 2) + Math.pow(py - this.y, 2));
    return d < dotSize;
  }
}

onMounted(() => {
  const canvas = document.getElementById("dots");
  const context = canvas.getContext("2d");
  
  resizeCanvas();
  function resizeCanvas() {

    const maxWidth = 640,
          maxHeight = 464;

    const heightMin = 305,
          widthMin = 494;

    const heightMicro = 305,
          widthMicro = 386;

    const guidePoints = [
      { x: 30, y: 290 },
      { x: 100, y: 40 },
      { x: 450, y: 40 },
      { x: 550, y: 290 },
      { x: 30, y: 290 },
    ];

    let scaleFactorX, scaleFactorY;

    if (window.innerWidth <= maxWidth && window.innerWidth > widthMin) {
      canvas.width = 490;
      canvas.height = 340;
    } 
    else if (window.innerWidth <= widthMin && window.innerWidth > widthMicro) {
      canvas.width = 370;
      canvas.height = 220;
    }

    else if (window.innerHeight <= maxHeight && window.innerHeight > heightMin) {
      canvas.width = 400;
      canvas.height = 350;
      
      document.querySelector('#dots').style.top = '0rem';
    }

    else if (window.innerHeight <= heightMin) {
      canvas.width = 290;
      canvas.height = 240;
    }

    else if (window.innerWidth <= widthMicro) {
      canvas.width = 280;
      canvas.height = 200;
    }

    else {
      canvas.width = 580;
      canvas.height = 420;
    }

    scaleFactorX = canvas.width / 580;
    scaleFactorY = canvas.height / 420;

    guideDots = [];
    for (let i = 0; i < guidePoints.length; i++) {
      guidePoints[i].x *= scaleFactorX;
      guidePoints[i].y *= scaleFactorY;
    }

    redrawCanvas();
    draw();

    for (let i = 0; i < guidePoints.length; i++) {
      guideDots.push(
        new Dot(guidePoints[i].x, guidePoints[i].y, "rgba(26,27,28,.7)")
      );
    }
  }

  function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resizeCanvas);

  let isDrawing = false;

  canvas.addEventListener("pointerdown", (event) => {
    isDrawing = true;
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
    mousePressed();
  });

  canvas.addEventListener("mousemove", (event) => {
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (isDrawing) {
      currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
      currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
      mousePressed()
    }
  });

  canvas.addEventListener("pointerup", () => {
    isDrawing = false;
  });

  canvas.addEventListener('touchstart', (event) => {
    isDrawing = true;
    const touch = event.touches[0];
    currentPos.x = touch.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = touch.clientY - canvas.getBoundingClientRect().top;
    mousePressed();
  });

  canvas.addEventListener('touchmove', (event) => {
    if (isDrawing) {
      const touch = event.touches[0];
      currentPos.x = touch.clientX - canvas.getBoundingClientRect().left;
      currentPos.y = touch.clientY - canvas.getBoundingClientRect().top;
      mousePressed()
    }
  });

  canvas.addEventListener('touchend', () => {
    if (isDrawing) {
      isDrawing = false;
    }
  });

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < guideDots.length; i++) {
      guideDots[i].plot(context);
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].plot(context);
      if (i > 0) {
        dots[i].connect(dots[i - 1].x, dots[i - 1].y, context);
      }
    }

    if (currentIndex === 0) {
      context.fillStyle = "rgb(226, 126, 110)";
      context.strokeStyle = "#E27E6E";
      context.lineWidth = 2;
      context.font = "24px Arial";
    } else if (!drawingCompleted) {
      context.strokeStyle = "rgb(226, 126, 110)";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(currentPos.x, currentPos.y);
      context.stroke();
    } else {
      fillVertex(context);
      context.fillStyle = "rgb(226, 126, 110)";
      context.strokeStyle = "rgb(222, 222, 222)";
      context.lineWidth = 10;
    }

    requestAnimationFrame(draw);
  }

  function fillVertex(ctx) {
    ctx.strokeStyle = "rgb(90, 90, 90)";
    ctx.fillStyle = "rgb(226, 126, 110)";
    ctx.lineWidth = 2; // Especifique a largura da linha aqui
    ctx.beginPath();
    for (let i = 0; i < dots.length; i++) {
      ctx.lineTo(dots[i].x, dots[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function mousePressed() {
    if (
      !drawingCompleted &&
      guideDots[currentIndex].within(currentPos.x, currentPos.y)
    ) {
      dots.push(new Dot(currentPos.x, currentPos.y, "#E27E6E"));
      currentIndex++;
      lastPos.x = currentPos.x;
      lastPos.y = currentPos.y;

      if (currentIndex === guideDots.length) {
        dots.push(new Dot(guideDots[0].x, guideDots[0].y, "#E27E6E"));
        document.querySelector(".veryGood").classList.add("active");
        document.querySelector(".canvasShow").style.display = "none";
        document.querySelector("#dots").style.display = "none";
        document.querySelector(".numbers").style.display = "none";
        document.querySelector(".arrow").style.display = "none";

        explosion.value = true
        drawingCompleted = true;
      }
    }
  }

  draw();
});
</script>

<template>
  <div class="trapeze">
    <img :src="shapeGameBg" class='img-background' alt="Descrição da imagem">
    <img :src="numberTrapeze" class='numbers' alt="numbers">
    <img :src='arrow' class="arrow">

    <img
      :src="butterBig"
      class="butter big"
      alt="butterfly">
    <img
      :src="butterSmall"
      class='butter small'
      id="butter-small"
      alt="butterfly">

    <BackButton :name="pageRoute" />
    <!-- <HomeButton /> -->
    <canvas class="canvasShow" id="dots"></canvas>

    <section class="veryGood">
      <article>
        <img :src="trapezePicture" alt="Forma de Trapézio completa" />
      </article>

      <ul class="container-stars">
        <div class="star-blink star1"></div>
        <div class="star-blink star2"></div>
        <div class="star-blink star3"></div>
        <div class="star-blink star1"></div>
        <div class="star-blink star2"></div>
        <div class="star-blink star3"></div>
        <div class="star-blink star1"></div>
        <div class="star-blink star2"></div>
        <div class="star-blink star3"></div>
      </ul>

      <div class="veryGood__text">
        <div class="writing-container">
            <h1 class="writing-text">Muito Bem!</h1>
        </div>
        <img
          @click="nextShape('/ShapeGamePentagon')"
          :src="nextButton"
          alt="Botão de seta para o próximo desafio de forma!"
        />
      </div>
    </section>

    <div v-if="explosion" class='confetti'>
      <ConfettiExplosion :numberOfPieces="900"/>
    </div>
  </div>
</template>

<style scoped>
.trapeze {
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.confetti {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display:grid;
  place-items:center;
  width: 100vw;
  height: 100vh;
  z-index: 3000;
  pointer-events: none;
}

.img-background {
  position:absolute;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  object-fit:cover;
  width:100vw;
  height:100vh;
}

.butter {
  position:absolute;
}

.butter.big {
  left:12rem;
  top:15rem;
  width:6rem;
  animation:butterfly-flap 7s ease-in-out infinite, just-appear .7s linear forwards;
}

.butter.small {
  width:4rem;
  right:11rem;
  top:21rem;
  animation:butterfly-flap 6s ease-in-out infinite; 
}

@keyframes butterfly-flap {
  0%, 100% {
    transform: translate(0px, 0px) rotateX(0) rotateY(0) rotate(20deg);
  }

  50% {
    transform: translate(5px, 14px) rotateX(3deg) rotateY(3deg) rotate(20deg);
  }
}

.container-stars {
  position: absolute;
  width:60%;
  top:20.5rem;
  z-index:4000;
  height:100px;
  pointer-events:none;
}

.star-blink {
    position:relative;
    width: 23px !important;
    height: 23px !important;
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

.star-blink:nth-child(1) {
    top:3rem;
    left:20%;
    background-color: rgba(255, 255, 255, 1);
}

.star-blink:nth-child(2) {
    top: 5rem;
    left: 70%;
    background-color: rgba(35, 181, 211, 1);
}

.star-blink:nth-child(3) {
    top: 5rem;
    left: 50%;
    background-color: rgba(243, 202, 64, 1);
}

.star-blink:nth-child(4) {
    top: 7rem;
    left: 40%;
    background-color: rgba(255, 255, 255, 1);
}

.star-blink:nth-child(5) {
    top:9rem;
    left: 10%;
    background-color: rgba(35, 181, 211, 1);
}

.star-blink:nth-child(6) {
    top: 6rem;
    left: 80%;
    background-color: rgba(243, 202, 64, 1);
}

.star-blink:nth-child(7) {
    top:10rem;
    left: 60%;
    background-color: rgba(255, 0, 0, 1);
}

.star-blink:nth-child(8) {
    top: 10rem;
    left: 30%;
    background-color: rgba(0, 255, 0, 1);
}

.star-blink:nth-child(9) {
    top: 10rem;
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

.numbers {
  position:absolute;
  width:30rem;
  margin-top:-4rem;
}

.arrow {
  position:absolute;
  margin-top:-28rem;
  width:8rem;
  margin-left:-36rem;
  animation:code 6s linear infinite;
}

@keyframes code {
  0% {
    opacity: .7;
    transform:scale(1);
  }

  50% {
    opacity: 1;
    transform:scale(1.1);
  }

  100% {
    opacity: .7;
    transform:scale(1);
  }
}

#dots {
  z-index: 900;
  position: relative;
}

.veryGood {
  position: absolute;
  top: 50%;
  user-select:none;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 1000;
  place-items: center;
  height: max-content;
}

.veryGood.active {
  display: grid;
  animation: just-appear 0.3s linear forwards;
}

.veryGood img {
  object-fit: cover;
}

.veryGood div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap:0rem;
  width: 500px;
  position: relative;
  left:1.5rem;
  margin-top: -4rem;
}

.veryGood.active .veryGood__text img {
  width:6rem !important;
  border-radius:1rem;
  margin-top:-3.2rem;
  cursor:pointer;
}

.veryGood.active .writing-container {
  text-align: center;
  position:relative;
  left:-.5rem;
  width:max-content;
}

.veryGood.active .writing-text {
  font-size:7rem;
  font-weight:bolder;
  letter-spacing:3px;
  color:#3626A7;
  overflow: hidden;
  white-space: nowrap;
  animation: typing .5s steps(30, end);
}

@keyframes typing {
  from {
      width: 0;
  }
  to {
      width: 100%;
  }
}

@media (max-width:736px), (max-height:386px) {
.veryGood article img {
  width:23rem;
  height: 16rem;
}

.veryGood div {
    width: 80%;
    left:0rem;
    top: 0rem;
  }

  .container-stars {

  width:80%;
  top:16rem;
  height:100px;
}

.star-blink {
    position:relative;
    width: 23px !important;
    height: 23px !important;
}

  .veryGood.active .veryGood__text img {
    margin-top:-1.5rem;
    width:4.5rem !important;
  }

  .veryGood.active .writing-container {
    text-align: center;
    position:relative;
    left:0rem;
    top:1rem;
    width:max-content;
  }

  .veryGood.active .writing-text {
    font-size:3.5rem;
  }
}

@media (max-height:386px) {
.veryGood div img:last-child {
  right:-4.5rem !important;
  top:.5rem !important;
  width:4rem !important;
}
}

@media (max-width:350px), (max-height:270px) {
.veryGood article img {
  height: 12rem;
}

.veryGood div {
  width: 16rem;
  top: 0rem;
  left:0%;
}
.veryGood div img:last-child {
  right:.5rem;
  top:4rem;
  width:3.5rem;
}
}

@media (max-height:270px) {
.veryGood div img:last-child {
  right:-3.5rem !important;
  top:.5rem !important;
  width:3rem !important;
}
}

@media (max-width:640px) {
  .numbers {
    width:24rem;
    margin-left:-1.5rem;
    margin-top:-3rem;
  }
}

@media (max-width:494px) {
.numbers {
  width:20rem;
  height:9rem;
  margin-left:.25rem;
  margin-top:-1rem;
}
}

@media (max-width:386px) {
.numbers {
  width:15rem;
  height:9rem;
  margin-left:.25rem;
  margin-top:-.25rem;
}
}

@media (max-height:465px) {
.numbers {
  width:21rem;
  margin-left:0rem;
  margin-top:-3rem;
}
}

@media (max-height:305px) {
.numbers {
  width:15rem;
  margin-top:-2.5rem;
  margin-left:.25rem;
}
}

@keyframes just-appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
