import { Vec2 } from "../../math";
import { AnimationVisualProperty } from "./visual-property";

export class AnimationScaleVisualProperty extends AnimationVisualProperty {
    public constructor(public readonly scale: Vec2){
        super();
    }
    public apply(context: CanvasRenderingContext2D, delta: number): void {
        const {x, y} = this.scale;
        // Rotate
        context.scale(1 + x * delta - delta, 1 + y * delta - delta);
    }
}