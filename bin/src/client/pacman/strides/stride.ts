import { Vec2 } from "../../../../../app/math";
import { TextureSource } from "../../../../../app/texture";
import { Utils } from "../../../../../app/utils";

export abstract class Stride extends TextureSource {
    public position = Vec2(0, 0);
    public constructor(public readonly radius: number){ super(); }
    public __render__(context: CanvasRenderingContext2D): void {
        const {x, y} = this.position;
        context.translate(x, y);
        if(Utils.isDebug) this.debug(context);
        this.update(context);
    }
    protected update(context: CanvasRenderingContext2D): void { super.__render__(context); }
    protected debug(context: CanvasRenderingContext2D): void {
        // Begin a new path for the circle
        context.beginPath();
        // Draw the circle
        context.arc(0, 0, this.radius * 2, 0, 2 * Math.PI);
        // Optionally fill the circle with a color
        //context.fillStyle = 'tr';
        //context.fill();
        // Optionally outline the circle with a color
        context.strokeStyle = 'white';
        context.stroke();
        context.closePath();
    }
}