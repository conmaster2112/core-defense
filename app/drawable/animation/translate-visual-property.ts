import { Vec2 } from "../../math";
import { AnimationVisualProperty } from "./visual-property";

export class AnimationTranslateVisualProperty extends AnimationVisualProperty {
    public constructor(public readonly offset: Vec2){
        super();
    }
    public apply(context: CanvasRenderingContext2D, delta: number): void {
        const {x, y} = this.offset;
        // Rotate
        context.translate(x * delta, y * delta);
    }
}