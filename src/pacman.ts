import { BLOCK_SIZE } from "./base";
import { Food } from "./food";
import pacmanImage from "./sprite/sprite.png";
import { GameElement, createImageElement } from "./utils";

interface DirectionObject {
  [key: string]: Direction;
}

interface PacmanProps {
  x: number;
  y: number;
  color?: string;
}
type PossibleDirectionKeys = "w" | "a" | "s" | "d";
type Direction = "left" | "right" | "top" | "bottom";

const possibleMoves = ["w", "a", "s", "d"];

const direction: DirectionObject = {
  a: "left",
  d: "right",
  w: "top",
  s: "bottom",
};

const pacmanSprite = createImageElement(pacmanImage);
export class Pacman {
  x: number;
  y: number;
  sX: number;
  sY: number;
  dx: 0 | 32;
  dy: 0 | 32;
  radius: 16;
  height: 32;
  width: 32;
  color: string;
  movementOffset: 0 | 32;
  frames: number;
  tick: number;
  maxTick: number;
  direction: null | Direction;

  constructor(props: PacmanProps) {
    this.x = props.x;
    this.y = props.y;
    this.radius = 16;
    this.height = 32;
    this.width = 32;
    this.sX = 4;
    this.sY = 4;
    this.color = props.color || "#FFFB00";
    this.initEventListener();
    this.direction = null;
    this.dx = 0;
    this.dy = 0;
    this.frames = 2;
    this.tick = 0;
    this.maxTick = 25;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.sX = this.frames * this.width;
    ctx.drawImage(
      pacmanSprite,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x - BLOCK_SIZE / 2,
      this.y - BLOCK_SIZE / 2,
      this.width,
      this.height
    );
  }

  getDirection(key: PossibleDirectionKeys): Direction {
    return direction[key];
  }

  setDirection(direction: null | Direction) {
    this.direction = direction;

    if (direction === "left" || direction === "right") this.dx = 32;
    if (direction === "top" || direction === "bottom") this.dy = 32;
  }

  update() {
    this.tick++;

    if (this.direction === "left") {
      this.x -= this.dx;
      this.frames = (Math.floor(this.tick / 1) % 2) + 3;
      return;
    }

    if (this.direction === "right") {
      this.x += this.dx;
      this.frames = Math.floor(this.tick / 1) % 2;
      return;
    }

    if (this.direction === "top") {
      this.y -= this.dy;
      this.frames = (Math.floor(this.tick / 1) % 2) + 5;
      return;
    }

    if (this.direction === "bottom") {
      this.y += this.dy;
      this.frames = (Math.floor(this.tick / 1) % 2) + 7;
    }
  }

  initEventListener = () => {
    addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space") this.setDirection(null);
      if (!possibleMoves.includes(e.key)) return;

      const currentDirection = this.getDirection(
        e.key as PossibleDirectionKeys
      );

      if (this.direction === currentDirection) return;

      this.setDirection(currentDirection);
    });
  };

  getWallCollisionDirection<T extends GameElement>(elem: T) {
    if (
      this.x + this.radius / 2 >= elem.x &&
      this.x - this.radius / 2 <= elem.x + elem.width &&
      this.y + this.radius / 2 >= elem.y &&
      this.y - this.radius / 2 <= elem.y + elem.height
    ) {
      const topDiff = elem.y + elem.height - (this.y - this.radius / 2);
      const bottomDiff = this.y + this.radius / 2 - elem.y;
      const leftDiff = elem.x + elem.width - (this.x - this.radius / 2);
      const rightDiff = this.x + this.radius / 2 - elem.x;

      const offset = Math.min(bottomDiff, topDiff, leftDiff, rightDiff);

      return {
        bottom: bottomDiff === offset,
        right: rightDiff === offset,
        left: leftDiff === offset,
        top: topDiff === offset,
        offset,
      };
    }

    return null;
  }

  isCollidingWithFood(food: Food) {
    const dx = this.x - food.x;
    const dy = this.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= this.radius + food.radius;
  }
}
