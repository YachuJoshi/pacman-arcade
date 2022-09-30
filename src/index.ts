import { Wall } from "./wall";
import { Pacman } from "./pacman";
import { BLOCK_SIZE } from "./base";
import { initCanvas } from "./canvas";
import { TILE_MAP } from "./constant";

import "./style.css";

let rID: number;
let pacman: Pacman;
let frames = 0;
let staggerFrames = 4;
const walls: Wall[] = [];
const { canvas, ctx } = initCanvas();

function init() {
  pacman = new Pacman({
    x: 304,
    y: 304,
  });

  TILE_MAP.forEach((row, rIndex) => {
    row.forEach((col, cIndex) => {
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
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  walls.forEach((wall) => wall.draw(ctx));
  pacman.draw(ctx);
}

function update() {
  if (frames % staggerFrames !== 0) return;

  pacman.update();

  walls.forEach((wall) => {
    const dir = pacman.getCollisionDirection(wall);

    if (!dir) return;

    const { left, right, top, bottom, offset } = dir;

    if (pacman.direction === "left" && left) {
      pacman.x += BLOCK_SIZE;
      pacman.setDirection(null);
    }
    if (pacman.direction === "right" && right) {
      pacman.setDirection(null);
    }
    if (pacman.direction === "top" && top) {
      pacman.y += BLOCK_SIZE;
      pacman.setDirection(null);
    }
    if (pacman.direction === "bottom" && bottom) {
      pacman.setDirection(null);
    }
  });
}

function animate() {
  frames++;
  rID = requestAnimationFrame(animate);

  draw();
  update();
}

init();
animate();
