<script setup>
import ConfettiExplosion from 'vue-confetti-explosion'

import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";

import starPicture from "../assets/images/starPicture.png";
import congratulationsImg from "../assets/images/congratulationsImg.png";
import nextButton from "../assets/images/nextButton.png";
import arrow from "../assets/images/0-arrow.png";

import { onMounted, ref } from "vue";
import shapeGameBg from "../assets/images/shapeGameBg.png";
import numberStar from "../assets/images/numbers/8-star.png";
import BackButton from "../components/BackButton.vue";
import HomeButton from "../components/HomeButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const pageRoute = ref("/ShapeGameOptions");

const nextShape = (next) => router.push(`${next}`);

let dots = [];

let explosion = ref(false)

let guideDots = [];
let currentIndex = 0;
let drawingCompleted = false;

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
  canvas.width = 630;
  canvas.height = 500;

  resizeCanvas();
  function resizeCanvas() {

    const maxWidth = 640,
          maxHeight = 464;

    const heightMin = 380,
          widthMin = 430

    const heightMicro = 270,
          widthMicro = 362

    const guidePoints = [
      { x: 445, y: 440 },
      { x: 425, y: 295 },
      { x: 522, y: 195 },
      { x: 380, y: 167 },
      { x: 315, y: 35 },
      { x: 250, y: 167 },
      { x: 105, y: 195 },
      { x: 207, y: 295 },
      { x: 185, y: 440 },
      { x: 315, y: 375 },
      { x: 445, y: 440 },
    ];

    let scaleFactorX, scaleFactorY;

    if (window.innerWidth <= maxWidth && window.innerWidth > widthMin) {
      canvas.width = 450;
      canvas.height = 370;
    } 
    else if (window.innerWidth <= widthMin && window.innerWidth > widthMicro) {
      canvas.width = 350;
      canvas.height = 270;
    }
    else if (window.innerHeight <= maxHeight && window.innerHeight > heightMin) {
      canvas.width = 470;
      canvas.height = 390;
      
      document.querySelector('#dots').style.top = '0rem';
    }

    else if (window.innerWidth <= widthMicro) {
      canvas.width = 280;
      canvas.height = 210;
    }

    else if (window.innerHeight <= heightMin) {
      canvas.width = 350;
      canvas.height = 270;
    }
    else {
      canvas.width = 630;
      canvas.height = 500;
    }

    scaleFactorX = canvas.width / 630;
    scaleFactorY = canvas.height / 500;

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
  <div class="star">
    <img :src="shapeGameBg" class='img-background' alt="Descrição da imagem">
    <img :src="numberStar" class='numbers' alt="numbers">
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
        <img :src="starPicture" alt="Forma de Estrela completa" />
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
          <h1 class="writing-text">Parabéns!</h1>
        </div>

        <img
          @click="nextShape('/GameModes')"
          :src="nextButton"
          alt="Botão de seta para o próximo desafio de forma!"
        />
      </div>
    </section>

    <div v-if="explosion" class='confetti'>
      <ConfettiExplosion :numberOfPieces="1200"/>
    </div>
  </div>
</template>

<style scoped>
.star {
  height: 100vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
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
  left:0;
  object-fit:cover;
  width:100vw;
  height:100vh;
}

.arrow {
  position:absolute;
  margin-top:15rem;
  width:6rem;
  margin-left:29rem;
  animation:code 6s linear infinite;
}

@keyframes code {
  0% {
    opacity: .7;
    transform:scale(1) rotate(115deg);
  }

  50% {
    opacity: 1;
    transform:scale(1.1) rotate(115deg);
  }

  100% {
    opacity: .7;
    transform:scale(1) rotate(115deg);
  }
}

.numbers {
  position:absolute;
  width:33rem;
  margin:-1rem 0 0 .5rem;
}

#dots {
  z-index: 900;
  position: relative;
  top:.5rem;
}

.butter {
  position:absolute;
}

.butter.big {
  right:18rem;
  top:5rem;
  width:6rem;
  animation:butterfly-flap 7s ease-in-out infinite, just-appear .7s linear forwards;
}

.butter.small {
  width:4rem;
  right:13rem;
  top:7rem;
  animation:butterfly-flap 6s ease-in-out infinite; 
}

@keyframes butterfly-flap {
  0%, 100% {
    transform: translate(0px, 0px) rotateX(0) rotateY(0) rotate(40deg);
  }

  50% {
    transform: translate(5px, 14px) rotateX(3deg) rotateY(3deg) rotate(40deg);
  }
}

.container-stars {
  position: absolute;
  width:80%;
  top:21.5rem;
  z-index:4000;
  height:100px;
  pointer-events:none;
}

.star-blink {
    position:relative;
    width: 30px !important;
    height: 30px !important;
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
    top:5rem;
    left:20%;
    background-color: #0C4767;
}

.star-blink:nth-child(2) {
    top: 5rem;
    left: 70%;
    background-color: rgba(35, 181, 211, 1);
}

.star-blink:nth-child(3) {
    top: 5rem;
    left: 50%;
    background-color:#A40606;
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
    background-color:#A40606;
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
    top: 8rem;
    left: 20%;
    background-color: #D83867;
}

@keyframes blink {
    0%, 100% {
        opacity: 0;
        transform:rotate(0deg);
    }
    25% {
        opacity: 1;
        transform:rotate(90deg);
    }

    50% {
        opacity: 1;
        transform:rotate(0deg);
    }

    75% {
      opacity: 1;
      transform:rotate(90deg);
    }
}

.veryGood {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 1000;
  user-select:none;
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
  width: 530px;
  position: relative;
  left: 3.5rem;
  margin-top: -3.4rem;
}

.veryGood.active .veryGood__text img {
  width:6.5rem !important;
border-radius:1rem;
cursor:pointer;
margin-top:-2rem;
}

.veryGood.active .writing-container {
  text-align: center;
  position:relative;
  left:-.5rem;
  width:max-content;
}

.veryGood.active .writing-text {
  font-size: 7.5rem;
  font-weight: bolder;
  letter-spacing: 3px;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 0.5s steps(30, end);
  background-image: linear-gradient(to bottom, #00916E, #4F4789, #033F63);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent; 
}

@keyframes typing {
  from {
    width:0;
  }
  to {
    width:100%;
  }
}

@media (max-width:800px), (max-height:500px) {

.veryGood img {
  object-fit: cover;
}
.veryGood article img {
  width: 22rem;
  height: 22rem;
}

.veryGood div {
    width: 420px;
    left: 3rem;
    top:1rem;
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
    margin-top:-1rem;
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
    font-size:5.5rem;
  }
}

@media (max-width:583px), (max-height:387px) {
.veryGood article img {
  width: 19rem;
  height: 18rem;
}

.veryGood div {
  width: 21rem;
  top: 1rem;
  left:0%;
}

.veryGood div img:first-child {
  width: 100%;
}

.veryGood div img:last-child {
  position:absolute;
  right:1rem;
  top:5rem;
  border-radius:.5rem;
  width:4rem;
}
}

@media (max-height:387px) {
.veryGood div img:last-child {
  right:-4.5rem !important;
  top:.5rem !important;
  width:4rem !important;
}
}

@media (max-width:340px), (max-height:350px) {
.veryGood article img {
  width: 15rem;
  height: 14rem;
}

.veryGood div {
  width: 16rem;
  top: 1rem;
  left:0%;
}
.veryGood div img:last-child {
  right:.5rem;
  top:4rem;
  width:3.5rem;
}
}

@media (max-height:350px) {
.veryGood div img:last-child {
  right:-3.5rem !important;
  top:.5rem !important;
  width:3rem !important;
}
}

@media (max-width:640px) {
  .numbers {
    width:16rem !important; 
    margin-left:0rem !important;
    margin-top:-.5rem !important;
  }
}

@media (max-width:414px) {
.numbers {
  width:11rem !important;
}
}

@media (max-width:362px) {
.numbers {
  margin-top:0rem !important;
  width:9rem !important;
}
}

@media (max-height:552px) {
.numbers {
  width:22rem;
  margin-left:0rem;
    margin-top:0rem;
}
}

@media (max-height:456px) {
.numbers {
  width:15rem;
 
  margin-left:.25rem;
}
}

@media (max-height:387px) {
.numbers {
  width:15rem !important;
  margin-top:-3.5rem !important;
  margin-left:.25rem !important;
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
