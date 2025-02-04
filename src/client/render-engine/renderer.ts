import { Vec2 } from "../math";
import { TextureRawData } from "../texture/texture-data";

export class RenderingEngine {
    public readonly canvas;
    public constructor(public readonly context: CanvasRenderingContext2D){
        this.canvas = context;
    }
    public drawTexture(text: TextureRawData, position: Vec2, size: Vec2): void{
        this.context.drawImage(text.src, text.x, text.y, text.w, text.h , position.x, position.y, size.x, size.y);
    }
    public reset(): void{
        this.context.reset();
        this.context.imageSmoothingEnabled = false;
    }
}