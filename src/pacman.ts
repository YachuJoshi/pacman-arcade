import { BLOCK_SIZE } from "./base";
import { GameElement } from "./utils";

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

export class Pacman {
  x: number;
  y: number;
  dx: 0 | 32;
  dy: 0 | 32;
  radius: 30;
  color: string;
  movementOffset: 0 | 32;
  direction: null | Direction;

  constructor(props: PacmanProps) {
    this.x = props.x;
    this.y = props.y;
    this.radius = 30;
    this.color = props.color || "yellow";
    this.initEventListener();
    this.direction = null;
    this.dx = 0;
    this.dy = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
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
    if (this.direction === "left") {
      this.x -= this.dx;
      return;
    }

    if (this.direction === "right") {
      this.x += this.dx;
      return;
    }

    if (this.direction === "top") {
      this.y -= this.dy;
      return;
    }

    this.y += this.dy;
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

  getCollisionDirection<T extends GameElement>(elem: T) {
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
}
