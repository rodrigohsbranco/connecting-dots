<script setup>
import trianglePicture from "../assets/images/trianglePicture.png";
import veryGoodImg from "../assets/images/veryGoodImg.png";
import nextButton from "../assets/images/nextButton.png";

import arrow from "../assets/images/0-arrow.png";

import { onMounted, ref } from "vue";
import shapeGameBg from "../assets/images/shapeGameBg.png";
import numberTriangle from "../assets/images/numbers/0-triangle.png";
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

let lastPos = { x: 100, y: 160 };
let currentPos = { x: 100, y: 160 };
let dotSize = 12;

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
          widthMin = 365;

    const guidePoints = [
      { x: 210, y: 20 },
      { x: 400, y: 330 },
      { x: 23, y: 330 },
      { x: 210, y: 20 },
    ];

    let scaleFactorX, scaleFactorY;

    if (window.innerWidth <= maxWidth && window.innerWidth > widthMin) {
      canvas.width = 350;
      canvas.height = 350;
    } 
    else if (window.innerWidth <= widthMin) {
      canvas.width = 290;
      canvas.height = 290;
    }
    else if (window.innerHeight <= maxHeight && window.innerHeight > heightMin) {
      canvas.width = 300;
      canvas.height = 300;
      
      document.querySelector('#dots').style.top = '0rem';
    }
    else if (window.innerHeight <= heightMin) {
      canvas.width = 250;
      canvas.height = 250;
    }
    else {
      canvas.width = 420;
      canvas.height = 420;
    }

    scaleFactorX = canvas.width / 420;
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
    ctx.lineWidth = 2;
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
        drawingCompleted = true;
      }
    }
  }

  draw();
});
</script>

<template>
  <div class="triangle">
    <img :src="shapeGameBg" class='img-background' alt="Descrição da imagem">
    <img :src="numberTriangle" class='numbers' alt="numbers">
    <img :src='arrow' class="arrow">

    <BackButton :name="pageRoute" />
    <!-- <HomeButton /> -->
    <canvas class="canvasShow" id="dots"></canvas>

    <section class="veryGood">
      <article>
        <img :src="trianglePicture" alt="Forma de Triângulo completa" />
      </article>

      <div class="veryGood__text">
        <img :src="veryGoodImg" alt="Mensagem de muito bem!" />
        <img
          @click="nextShape('/ShapeGameCircle')"
          :src="nextButton"
          alt="Botão de seta para o próximo desafio de forma!"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.triangle {
  height: 100vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.img-background {
  position:absolute;
  top:0;
  left:0;
  object-fit:cover;
  width:100vw;
  height:100vh;
}

.numbers {
  position:absolute;
  width:25.5rem;
  height:25rem;
  margin-left:.5rem;
  margin-top:2rem;
}

.arrow {
  position:absolute;
  margin-top:-26rem;
  width:8rem;
  margin-left:-16rem;
  animation:code 3s linear infinite;
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
  z-index: 1000;
  position: relative;
  top: 3.3rem;
}

.veryGood {
  position: absolute;
  top: 50%;
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
.veryGood article img {
  width: 28rem;
  height: 25rem;
  border-radius: 0.5rem;
}

.veryGood div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 580px;
  position: relative;
  left: 4rem;
  top: -1rem;
}

.veryGood div img:first-child {
  width: 29rem;
}

.veryGood div img:last-child {
  cursor: pointer;
  border-radius: 1rem;
}

.veryGood__text {
  margin-top: -1rem;
}

@media (max-width:800px), (max-height:480px) {

.veryGood img {
  object-fit: cover;
}
.veryGood article img {
  width: 22rem;
  height: 19rem;
}

.veryGood div {
  width: 460px;
  left: 3rem;
  top: -1rem;
}

.veryGood div img:first-child {
  width: 23rem;
}
}

@media (max-width:583px), (max-height:360px) {
.veryGood article img {
  width: 19rem;
  height: 16rem;
}

.veryGood div {
  width: 21rem;
  top: -1rem;
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

@media (max-height:360px) {
.veryGood div img:last-child {
  right:-4.5rem !important;
  top:.5rem !important;
  width:4rem !important;
}
}

@media (max-width:340px), (max-height:270px) {
.veryGood article img {
  width: 15rem;
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
    width:21rem;
    height:18rem;
    margin-left:.5rem;
    margin-top:-.25rem;
  }
}

@media (max-width:365px) {
.numbers {
  width:17.5rem;
  height:14.5rem;
  margin-left:.25rem;
  margin-top:.5rem;
}
}

@media (max-height:465px) {
.numbers {
  width:18rem;
  height:12rem;
  margin-left:.25rem;
  margin-top:-3rem;
}
}

@media (max-height:305px) {
.numbers {
  width:15rem;
  height:10rem;
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
