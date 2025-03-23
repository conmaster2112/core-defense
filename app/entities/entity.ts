import { Stride } from "../drawable";
import { Vec2 } from "../math";

export class Entity extends Stride {
    public velocity: Vec2 = Vec2(0, 0);
    public constructor(){ super(null!); }
    public __render__(context: CanvasRenderingContext2D): void {
        //@ts-expect-error __delta__ is specif and weird
        const {x, y} = this.velocity, d = context.__delta__;
        context.translate(x * d, y * d);
        super.__render__(context);
    }
}