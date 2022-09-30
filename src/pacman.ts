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
  radius: 32;
  color: string;
  movementOffset: 0 | 32;
  direction: null | Direction;

  constructor(props: PacmanProps) {
    this.x = props.x;
    this.y = props.y;
    this.radius = BLOCK_SIZE;
    this.color = props.color || "yellow";
    this.initEventListener();
    this.direction = null;
    this.movementOffset = BLOCK_SIZE;
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
  }

  update() {
    if (!this.direction) return;

    if (this.direction === "left") {
      this.x -= this.movementOffset;
      return;
    }

    if (this.direction === "right") {
      this.x += this.movementOffset;
      return;
    }

    if (this.direction === "top") {
      this.y -= this.movementOffset;
      return;
    }

    this.y += this.movementOffset;
  }

  initEventListener = () => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!possibleMoves.includes(e.key)) return;
      if (this.direction === this.getDirection(e.key as PossibleDirectionKeys))
        return;

      this.setDirection(this.getDirection(e.key as PossibleDirectionKeys));
    });
  };

  getCollisionDirection<T extends GameElement>(elem: T) {
    if (
      this.x + this.radius >= elem.x &&
      this.x <= elem.x + elem.width &&
      this.y + this.radius >= elem.y &&
      this.y <= elem.y + elem.height
    ) {
      const topDiff = elem.y + elem.height - this.y;
      const bottomDiff = this.y + this.radius - elem.y;
      const leftDiff = elem.x + elem.width - this.x;
      const rightDiff = this.x + this.radius - elem.x;

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
