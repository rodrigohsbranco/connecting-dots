<script setup>
import pentagonPicture from "../assets/images/pentagonPicture.png";
import veryGoodImg from "../assets/images/veryGoodImg.png";
import nextButton from "../assets/images/nextButton.png";
import arrow from "../assets/images/0-arrow.png";

import { onMounted, ref } from "vue";
import shapeGameBg from "../assets/images/shapeGameBg.png";
import numberPentagon from "../assets/images/numbers/3-pentagon.png";
import BackButton from "../components/BackButton.vue";
import HomeButton from "../components/HomeButton.vue";
import { useRouter } from "vue-router";

import butterBig from "../assets/images/butterbig.png";
import butterSmall from "../assets/images/buttersmall.png";
import ConfettiExplosion from 'vue-confetti-explosion'

const router = useRouter();

const pageRoute = ref("/ShapeGameOptions");

const nextShape = (next) => router.push(`${next}`);

let explosion = ref(false)

let dots = [];
let guideDots = [];
let currentIndex = 0;
let drawingCompleted = false;

let lastPos = { x: 100, y: 160 };
let currentPos = { x: 100, y: 160 };
let dotSize = 12;
let clearLine = false

let currentPulsatingIndex = 0;
const minParticleSize = 8
const maxParticleSize = 15

const minOpacity = 0.7
const maxOpacity = 1
const opacityChangeSpeed = .01

const minSpeed = -1
const maxSpeed = 2

const particles = []//aqui

class Dot {
  constructor(x, y, strokeColor) {
    this.x = x;
    this.y = y;
    this.strokeColor = strokeColor;
    this.isPulsating = false
    this.scale = 1
    this.scaleDirection = 1; 
    this.pulseSpeed = 0.005
  }
  connect(px, py, ctx) {
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 15; // Especifique a largura da linha aqui
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
  plot(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)

    const drawX = 0
    const drawY = 0

    ctx.scale(this.scale, this.scale)

    ctx.fillStyle = "rgb(226, 126, 110)"
    ctx.strokeStyle = this.strokeColor
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(drawX, drawY, dotSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
  within(px, py) {
    let d = Math.sqrt(Math.pow(px - this.x, 2) + Math.pow(py - this.y, 2));
    return d < dotSize;
  }

  pulse() {
    this.scale += this.scaleDirection * this.pulseSpeed;

    if (this.scale <= 1 || this.scale >= 1.3) {
      this.scaleDirection *= -1;
    }
  }
  startPulsating() {
    this.isPulsating = true;
    this.animatePulse();
    this.strokeColor = '#820B8A'
  }
  stopPulsating() {
    this.isPulsating = false;
    this.scale = 1;
    this.strokeColor = '#5386E4'
  }
  animatePulse() {
    if (this.isPulsating) {
      this.pulse()
      requestAnimationFrame(this.animatePulse.bind(this))
    }
  }
}

onMounted(() => {
  const canvas = document.getElementById("dots");
  const context = canvas.getContext("2d");

  const canvasParticles = document.getElementById("particles")
  const contextParticles = canvasParticles.getContext("2d")//aqui

  const canvasStars = document.getElementById("starsCanvas")
  const contextStars = canvasStars.getContext("2d")
  
  resizeCanvas();
  function resizeCanvas() {

    const maxWidth = 640,
          maxHeight = 464;

    const heightMin = 314,
          widthMin = 430

    const heightMicro = 270,
          widthMicro = 362

    const guidePoints = [
      { x: 90, y: 155 },
      { x: 290, y: 20 },
      { x: 495, y: 160 },
      { x: 420, y: 395 },
      { x: 162, y: 395 },
      { x: 90, y: 155 },
    ];

    let scaleFactorX, scaleFactorY;

    if (window.innerWidth <= maxWidth && window.innerWidth > widthMin) {
      canvas.width = 450;
      canvas.height = 370;

      canvasParticles.width = 450;
      canvasParticles.height = 370;
      
      canvasStars.width = 480;
      canvasStars.height = 370;
    } 
    else if (window.innerWidth <= widthMin && window.innerWidth > widthMicro) {
      canvas.width = 350;
      canvas.height = 270;

      canvasParticles.width = 350;
      canvasParticles.height = 270;
      
      canvasStars.width = 380;
      canvasStars.height = 270;
    }
    else if (window.innerHeight <= maxHeight && window.innerHeight > heightMin) {
      canvas.width = 470;
      canvas.height = 390;

      canvasParticles.width = 470;
      canvasParticles.height = 390;
      
      canvasStars.width = 500;
      canvasStars.height = 390;
      
      document.querySelector('#dots').style.top = '0rem';
    }

    else if (window.innerWidth <= widthMicro) {
      canvas.width = 280;
      canvas.height = 210;

      canvasParticles.width = 280;
      canvasParticles.height = 210;
      
      canvasStars.width = 310;
      canvasStars.height = 210;
    }

    else if (window.innerHeight <= heightMin) {
      canvas.width = 350;
      canvas.height = 270;

      canvasParticles.width = 350;
      canvasParticles.height = 270;
      
      canvasStars.width = 380;
      canvasStars.height = 270;
    }
    else {
      canvas.width = 580;
      canvas.height = 500;

      canvasParticles.width = 480;
      canvasParticles.height = 500;
      
      canvasStars.width = 510;
      canvasStars.height = 500;
    }

    scaleFactorX = canvas.width / 580;
    scaleFactorY = canvas.height / 500;

    guideDots = [];
    for (let i = 0; i < guidePoints.length; i++) {
      guidePoints[i].x *= scaleFactorX;
      guidePoints[i].y *= scaleFactorY;
    }

    redrawCanvas();
    draw();

    for (let i = 0; i < guidePoints.length; i++) {
      const dot = new Dot(guidePoints[i].x, guidePoints[i].y, "#5386E4");
      if (i === 0) {
        dot.startPulsating()
      }
      guideDots.push(dot);
    }
  }

  function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resizeCanvas);

  let isDrawing = false;

  canvas.addEventListener("pointerdown", (event) => {
    isDrawing = true;
    clearLine = false
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
    canvasParticles.classList.add('drawing')

    mousePressed();
  });

  canvas.addEventListener("mousemove", (event) => {
    clearLine = false
    currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = event.clientY - canvas.getBoundingClientRect().top;

    if (canvasParticles.classList.contains('drawing')) {
      const particlesCanvas = document.getElementById("particles")
      const particlesCtx = particlesCanvas.getContext("2d")
      const particlesCanvasRect = particlesCanvas.getBoundingClientRect()

      const adjustedX = (event.clientX - particlesCanvasRect.left) * (particlesCanvas.width / particlesCanvasRect.width)
      const adjustedY = (event.clientY - particlesCanvasRect.top) * (particlesCanvas.height / particlesCanvasRect.height)

      createParticle(adjustedX, adjustedY)
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (isDrawing) {
      clearLine = false
      currentPos.x = event.clientX - canvas.getBoundingClientRect().left;
      currentPos.y = event.clientY - canvas.getBoundingClientRect().top;
      mousePressed()
    }
  });

  canvas.addEventListener("pointerup", () => {
    isDrawing = false;
    clearLine = false
  });

  canvas.addEventListener('touchstart', (event) => {
    isDrawing = true;
    clearLine = false
    const touch = event.touches[0];
    currentPos.x = touch.clientX - canvas.getBoundingClientRect().left;
    currentPos.y = touch.clientY - canvas.getBoundingClientRect().top;
    mousePressed();
  });

  canvas.addEventListener('touchmove', (event) => {
    if (isDrawing) {
      clearLine = false

      const touch = event.touches[0];
      currentPos.x = touch.clientX - canvas.getBoundingClientRect().left;
      currentPos.y = touch.clientY - canvas.getBoundingClientRect().top;

      const particlesCanvas = document.getElementById("particles");
      const particlesCtx = particlesCanvas.getContext("2d");
      const particlesCanvasRect = particlesCanvas.getBoundingClientRect();

      const adjustedX = (touch.clientX - particlesCanvasRect.left) * (particlesCanvas.width / particlesCanvasRect.width);
      const adjustedY = (touch.clientY - particlesCanvasRect.top) * (particlesCanvas.height / particlesCanvasRect.height);

      createParticle(adjustedX, adjustedY);

      mousePressed();
    }
  });

  canvas.addEventListener('touchend', () => {
    if (isDrawing) {
      clearLine = true
      isDrawing = false;
    }
  });

  const explosionDuration = 500;
  const stars = [];

  function createStar(x, y, size, opacity, rotation) {
    contextStars.save();
    contextStars.translate(x, y);
    contextStars.rotate(rotation);
    contextStars.beginPath();
    contextStars.moveTo(0, -size * 2);

    const angles = [0, 72, 144, 216, 288];

    const gradient = contextStars.createRadialGradient(0, 0, 0, 0, 0, size)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(1, 'rgba(243,202,64,1)')

    contextStars.fillStyle = gradient

    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i] * (Math.PI / 180);
      const x2 = size * Math.cos(angle);
      const y2 = size * Math.sin(angle);
      contextStars.lineTo(x2, y2);

      const angle2 = (angles[i] + 36) * (Math.PI / 180);
      const x3 = (size / 2) * Math.cos(angle2);
      const y3 = (size / 2) * Math.sin(angle2);
      contextStars.lineTo(x3, y3);
    }

    contextStars.closePath();
    contextStars.globalAlpha = opacity;
    contextStars.fill();
    contextStars.globalAlpha = 1;
    contextStars.restore();
  }

  function createExplosion(x, y) {
    const explosionDistance = 800;

    for (let i = 0; i < 2; i++) {
      const size = 16;
      const angle = (i === 0 ? 30 : 150) * (Math.PI / 180);
      const x2 = x + explosionDistance * Math.cos(angle);
      const y2 = y + explosionDistance * Math.sin(angle);

      const dx = (x2 - x) / explosionDuration;
      const dy = (y2 - y) / explosionDuration;

      stars.push({
        x: x,
        y: y,
        size: size,
        opacity: 1.0,
        dx: dx,
        dy: dy,
        startTime: Date.now(),
        rotation: Math.random() * (Math.PI * 2),
      });
    }
  }

  function drawStars() {
    contextStars.clearRect(0, 0, canvasStars.width, canvasStars.height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const elapsed = Date.now() - star.startTime;

      if (elapsed < explosionDuration) {
        star.x += star.dx;
        star.y += star.dy;
        star.rotation += 0.1;
        if (star.rotation >= Math.PI * 2) {
          star.rotation -= Math.PI * 2;
        }

        if (elapsed >= explosionDuration - 100) {
          star.opacity = 1 - ((elapsed - (explosionDuration - 100)) / 100);
        } else {
          star.opacity = 1.0;
        }

        createStar(star.x, star.y, star.size, star.opacity, star.rotation);
      } else {
        stars.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(drawStars);
  }

  drawStars();

  //particles
  function createParticle(x, y) {
  for (let i = 0; i < 1; i++) { 
    const randomX = x + (Math.random() * 80 - 20)
    const randomY = y + (Math.random() * 80 - 20)
    const randomSize = minParticleSize + Math.random() * (maxParticleSize - minParticleSize)
    const randomColor = getRandomColor()
    const randomOpacity = minOpacity + Math.random() * (maxOpacity - minOpacity)
    const randomSpeedX = minSpeed + Math.random() * (maxSpeed - minSpeed)
    const randomSpeedY = minSpeed + Math.random() * (maxSpeed - minSpeed)

    particles.push({
      x: randomX,
      y: randomY,
      size: randomSize,
      color: randomColor,
      opacity: randomOpacity,
      speedX: randomSpeedX,
      speedY: randomSpeedY,
    })
  }
}

function updateParticles() {
  contextParticles.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i]

    if (particle.opacity <= 0) {
      particles.splice(i, 1)
      i--
      continue
    }

    contextParticles.save()

    createPolygonClip(contextParticles, particle.x, particle.y, particle.size)

    contextParticles.globalAlpha = particle.opacity
    contextParticles.filter = 'blur(1px)'
    contextParticles.fillStyle = particle.color
    contextParticles.beginPath()
    contextParticles.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    contextParticles.fill()
    contextParticles.restore()

    particle.x += particle.speedX
    particle.y += particle.speedY

    particle.opacity -= opacityChangeSpeed
  }

  requestAnimationFrame(updateParticles)
}

updateParticles()

//estrelas brancas
// function getRandomColor() {
//   const alpha = 0.6 + Math.random() * 0.4
//   const color = `rgba(255, 255, 255, ${alpha})`

//   return color
// }

//estrelas coloridas
function getRandomColor() {
  const colors = [
    "rgba(255,255,255,1)",
    "rgba(35,181,211,1)",
    "rgba(243,202,64,1)",
  ];

  const color = colors[Math.floor(Math.random() * colors.length)]

  const randomOpacity = 0.6 + Math.random() * 0.4

  const rgbaMatch = color.match(/rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/)
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch.map(parseFloat)
    return `rgba(${r}, ${g}, ${b}, ${randomOpacity})`
  }

  return color
}
getRandomColor()

function createPolygonClip(ctx, x, y, size) {
  ctx.beginPath()
  ctx.moveTo(x + size * 0.38, y + size * 0.35)
  ctx.lineTo(x + size * 0.51, y + size * 0)
  ctx.lineTo(x + size * 0.62, y + size * 0.36)
  ctx.lineTo(x + size * 1, y + size * 0.48)
  ctx.lineTo(x + size * 0.61, y + size * 0.60)
  ctx.lineTo(x + size * 0.48, y + size * 1)
  ctx.lineTo(x + size * 0.37, y + size * 0.59)
  ctx.lineTo(x + size * 0, y + size * 0.47)
  ctx.closePath()
  ctx.clip()
}

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
      if (clearLine) { // Verifique se clearLine é verdadeiro
        context.linerWidth = 0
      }

      else {
        context.strokeStyle = "rgb(226, 126, 110)";
        context.lineWidth = 11;
        context.beginPath();
        context.moveTo(lastPos.x, lastPos.y);
        context.lineTo(currentPos.x, currentPos.y);
        context.stroke();
      }
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
  if (!drawingCompleted && guideDots[currentIndex].within(currentPos.x, currentPos.y)) {
    dots.push(new Dot(currentPos.x, currentPos.y, "#E27E6E", true));
    const rect = canvasStars.getBoundingClientRect()

    let xValue = currentPos.x - 35,
        yValue = currentPos.y + 50

    createExplosion(xValue, yValue);
    currentIndex++;
    lastPos.x = currentPos.x;
    lastPos.y = currentPos.y;

    if (currentPulsatingIndex < guideDots.length - 1) {
      guideDots[currentPulsatingIndex].stopPulsating()

      currentPulsatingIndex++
      guideDots[currentPulsatingIndex].startPulsating()
    }

    if (currentIndex === guideDots.length) {
      dots.push(new Dot(guideDots[0].x, guideDots[0].y, "#E27E6E"));
      document.querySelector(".veryGood").classList.add("active");
      document.querySelector(".canvasShow").style.display = "none";

      document.querySelector("#dots").style.display = "none";
      document.querySelector(".numbers").style.display = "none";
      document.querySelector(".arrow").style.display = "none";

      document.querySelector("#particles").style.display = "none";
      document.querySelector("#starsCanvas").style.display = "none";

      explosion.value = true
      drawingCompleted = true
    }
  }
}

  draw();
});
</script>

<template>
  <div class="pentagon">
    <img :src="shapeGameBg" class='img-background' alt="Descrição da imagem">
    <img :src="numberPentagon" class='numbers' alt="numbers">
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
    <canvas id="particles"></canvas>
    <canvas id="starsCanvas"></canvas>

    <section class="veryGood">
      <article>
        <img :src="pentagonPicture" alt="Forma de Pentágono completa" />
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
          @click="nextShape('/ShapeGameEllipse')"
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
.pentagon {
  height: 100vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  display: grid;
  place-items: center;
}

#particles, #starsCanvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.numbers {
  position:absolute;
  width:29.5rem;
  margin-left:.5rem;
}

.arrow {
  position:absolute;
  margin-top:-14.5rem;
  width:8rem;
  margin-left:-38rem;
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
  top:2.5rem;
}

.butter {
  position:absolute;
}

.butter.big {
  right:11rem;
  top:21rem;
  width:6rem;
  animation:butterfly-flap 7s ease-in-out infinite, just-appear .7s linear forwards;
}

.butter.small {
  width:4rem;
  right:12rem;
  top:15rem;
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
  width:80%;
  top:22rem;
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

.arrow, .butter, #dots {
 user-select:none;
}

.veryGood {
  user-select:none;
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

.veryGood div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap:0rem;
  width: 480px;
  position: relative;
  left: 3.5rem;
  margin-top: -2rem;
}

.veryGood.active .veryGood__text img {
  width:6rem !important;
  margin-top:-1rem;
border-radius:1rem;
cursor:pointer;
}

.veryGood.active .writing-container {
  text-align: center;
  position:relative;
  left:-.5rem;
  width:max-content;
}

.veryGood.active .writing-text {
  font-size:5.5rem;
  font-weight:bolder;
  letter-spacing:3px;
  color:#1446A0;
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

@media (max-width:800px), (max-height:480px) {

.veryGood img {
  object-fit: cover;
}
.veryGood article img {
  width: 22rem;
  height: 21rem;
}

.veryGood div {
    width: 460px;
    left: 3rem;
    top: -1rem;
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
    margin-top:.5rem;
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

@media (max-height:387px) {
.veryGood div img:last-child {
  right:-4.5rem !important;
  top:.5rem !important;
  width:4rem !important;
}
}

@media (max-width:340px), (max-height:322px) {
.veryGood article img {
  width: 15rem;
  height: 14rem;
}

.veryGood div {
  width: 16rem;
  top: -1rem;
  left:0%;
}
.veryGood div img:last-child {
  right:.5rem;
  top:4rem;
  width:3.5rem;
}
}

@media (max-height:322px) {
.veryGood div img:last-child {
  right:-3.5rem !important;
  top:.5rem !important;
  width:3rem !important;
}
}

@media (max-width:640px) {
  .numbers {
    width:21rem;
    height:15rem;
    margin-left:.5rem;
    margin-top:2rem;
  }
}

@media (max-width:414px) {
.numbers {
  width:14rem;
  height:11.5rem;
  margin-left:.25rem;
  margin-top:2.3rem;
}
}

@media (max-width:362px) {
.numbers {
  width:11rem;
  height:8rem;
  margin-left:.25rem;
  margin-top:3rem;
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
