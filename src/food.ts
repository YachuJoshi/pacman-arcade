interface FoodProps {
  x: number;
  y: number;
}

export class Food {
  x: number;
  y: number;
  radius = 2;
  color: string;

  constructor(props: FoodProps) {
    this.x = props.x;
    this.y = props.y;
    this.color = "#F8B090";
    this.radius = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
