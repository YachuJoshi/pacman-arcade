import { Food } from "./food";
import { Wall } from "./wall";
import { Pacman } from "./pacman";
import { BLOCK_SIZE } from "./base";
import { initCanvas } from "./canvas";
import { TILE_MAP } from "./constant";
import { scoreElem } from "./elements";
import { createAudioElement } from "./utils";

import BG_AUDIO from "./audio/bg.wav";
import WIN_AUDIO from "./audio/win.wav";

import "./style.css";

let rID: number;
let pacman: Pacman;
let score = 0;
let frames = 0;
let staggerFrames = 5;
let bgAudio = createAudioElement(BG_AUDIO);
let winAudio = createAudioElement(WIN_AUDIO);
let isPlaying: boolean = false;
let foods: Food[] = [];
const walls: Wall[] = [];
const { canvas, ctx } = initCanvas();

function init() {
  pacman = new Pacman({
    x: 304,
    y: 304,
  });

  TILE_MAP.forEach((row, rIndex) => {
    row.forEach((col, cIndex) => {
      // Food
      if (col === 0) {
        foods.push(
          new Food({
            x: cIndex * BLOCK_SIZE + BLOCK_SIZE / 2,
            y: rIndex * BLOCK_SIZE + BLOCK_SIZE / 2,
          })
        );
      }

      // Wall
      if (col === 1) {
        walls.push(
          new Wall({
            x: cIndex * BLOCK_SIZE,
            y: rIndex * BLOCK_SIZE,
          })
        );
      }
    });
  });

  addEventListener("keydown", async (_) => {
    if (isPlaying) return;

    isPlaying = true;
    await bgAudio.play();
    bgAudio.loop = true;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  walls.forEach((wall) => wall.draw(ctx));
  foods.forEach((food) => food.draw(ctx));
  pacman.draw(ctx);
}

function update() {
  if (frames % staggerFrames !== 0) return;

  pacman.update();
  scoreElem.textContent = `${score}`;

  walls.forEach((wall) => {
    const dir = pacman.getWallCollisionDirection(wall);

    if (!dir) return;

    const { left, right, top, bottom } = dir;

    if (pacman.direction === "left" && left) {
      pacman.x += BLOCK_SIZE;
      pacman.dx = 0;
    }

    if (pacman.direction === "right" && right) {
      pacman.x -= BLOCK_SIZE;
      pacman.dx = 0;
    }

    if (pacman.direction === "top" && top) {
      pacman.y += BLOCK_SIZE;
      pacman.dy = 0;
    }

    if (pacman.direction === "bottom" && bottom) {
      pacman.y -= BLOCK_SIZE;
      pacman.dy = 0;
    }
  });

  foods.forEach((food, i) => {
    // Eat Food
    if (pacman.isCollidingWithFood(food)) {
      score += 50;
      foods.splice(i, 1);
    }
  });
}

function animate() {
  frames++;
  rID = requestAnimationFrame(animate);

  if (foods.length <= 0) {
    bgAudio.pause();
    winAudio.play();
    cancelAnimationFrame(rID);
    console.log("You won!");
  }

  draw();
  update();
}

init();
animate();
