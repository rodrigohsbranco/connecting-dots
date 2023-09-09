<script setup>
import starPicture from '../assets/images/starPicture.png'
import congratulationsImg from '../assets/images/congratulationsImg.png'
import nextButton from '../assets/images/nextButton.png'

import { onMounted, ref } from "vue";
import starBg from "../assets/images/starBg.png";
import BackButton from "../components/BackButton.vue";
import HomeButton from "../components/HomeButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const pageRoute = ref("/shape");

const nextShape = (next)  => router.push(`${next}`);

let dots = [];
let guideDots = [];
let currentIndex = 0;
let drawingCompleted = false;

let lastPos = { x: 100, y: 160 };
let currentPos = { x: 100, y: 160 };
let dotSize = 9;

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
];

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

  for (let i = 0; i < guidePoints.length; i++) {
    guideDots.push(new Dot(guidePoints[i].x, guidePoints[i].y, "rgb(120, 120, 120)"));
  }

  canvas.addEventListener("mousedown", (event) => {
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
    mousePressed();
  });

  canvas.addEventListener("mousemove", (event) => {
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
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
    } 
    
    else if (!drawingCompleted) {
      context.strokeStyle = "rgb(226, 126, 110)";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(currentPos.x, currentPos.y);
      context.stroke();
    } 
    
    else {
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
    if (!drawingCompleted && guideDots[currentIndex].within(currentPos.x, currentPos.y)) {
      dots.push(new Dot(currentPos.x, currentPos.y, "#E27E6E"));
      currentIndex++;
      lastPos.x = currentPos.x;
      lastPos.y = currentPos.y;

      if (currentIndex === guideDots.length) {
        dots.push(new Dot(guideDots[0].x, guideDots[0].y, "#E27E6E"));
        document.querySelector('.congratulations').classList.add('active');
        document.querySelector('.canvasShow').style.display = 'none';
        drawingCompleted = true;
      }
    }
  }

  draw();
});
</script>

<template>
  <div class="star" :style="{ backgroundImage: `url(${starBg})` }">
    <BackButton :name="pageRoute" />
    <HomeButton />
    <canvas class="canvasShow" id="dots"></canvas>

    <section class="congratulations">
      <article>
        <img :src="starPicture" alt="Forma de Estrela completa">
      </article>

      <div class="congratulations__text">
        <img :src="congratulationsImg" alt="Parabéns!">
        <img @click="nextShape('/modes')" :src="nextButton" alt="Botão de seta para o próximo desafio de forma!">
      </div>
    </section>
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
#dots {
  z-index: 900;
  position: relative;
  top: 3.3rem;
}

.congratulations {
  position:absolute;
  top:8rem;
  width:100vw;
  margin:auto;
  left:0;
  display:none;
  z-index:1000;
  place-items:center;
  height:max-content;
}

.congratulations.active {
  display:grid;
  animation:just-appear .3s linear forwards;
}

.congratulations img {
  object-fit:cover;
}

.congratulations div {
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:580px;
  position:relative;
  left:4rem;
  top:-1rem;
}

.congratulations div img:first-child {
  width:29rem;
}

.congratulations div img:last-child {
  cursor:pointer;
  border-radius:1rem;
}

.congratulations__text {
  margin-top: -4rem;
}

@keyframes just-appear {
  from {
    opacity:0;
    transform:translateY(-2rem);
  }

  to {
    opacity:1;
    transform:translateY(0);
  }
}
</style>
