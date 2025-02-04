export abstract class Drawable {
    protected abstract __render__(context: CanvasRenderingContext2D): void;
    public render(context: CanvasRenderingContext2D): void{
        context.save();
        this.__render__(context);
        context.restore();
    }
}