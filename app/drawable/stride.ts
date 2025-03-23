import { Vec2 } from "../math";
import { Drawable } from "./drawable";
import { Visual } from "./visual";

export class Stride extends Drawable {
    public constructor(public visual: Visual){super();}
    public scaleX = 1.0;
    public scaleY = 1.0;
    public rotation = 0.0;
    public position = Vec2(0, 0);
    protected __render__(context: CanvasRenderingContext2D): void {
        context.translate(this.position.x, this.position.y);
        context.scale(this.scaleX, this.scaleY);
        if(this.rotation) context.rotate(this.rotation);
        this.visual.draw(context);
    }
}