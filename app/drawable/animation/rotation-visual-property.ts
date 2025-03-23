import { AnimationVisualProperty } from "./visual-property";

export class AnimationRotationVisualProperty extends AnimationVisualProperty {
    public constructor(public readonly rad: number){
        super();
    }
    public apply(context: CanvasRenderingContext2D, delta: number): void {
        // Rotate
        context.rotate(this.rad * delta);
    }
}