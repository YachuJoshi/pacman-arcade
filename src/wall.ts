import { BLOCK_SIZE } from "./base";

interface WallProps {
  x: number;
  y: number;
}

export class Wall {
  x: number;
  y: number;
  height: 32;
  width: 32;
  color: string;
  strokeStyle: string;

  constructor(props: WallProps) {
    this.x = props.x;
    this.y = props.y;
    this.height = BLOCK_SIZE;
    this.width = BLOCK_SIZE;
    this.color = "red";
    this.strokeStyle = "black";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeStyle;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
  }
}
