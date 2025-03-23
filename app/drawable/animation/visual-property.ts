export abstract class AnimationVisualProperty {
    public abstract apply(context: CanvasRenderingContext2D, delta: number): void;
}