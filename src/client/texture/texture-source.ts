import { Drawable } from "./drawable";
import { TextureRawData } from "./texture-data";

export abstract class TextureSource extends Drawable {
    public scaleX = 1.0;
    public scaleY = 1.0;
    public rotation = 0.0;
    public abstract getTextureData(): TextureRawData;
    protected __render__(context: CanvasRenderingContext2D): void {
        const data = this.getTextureData();
        context.scale(this.scaleX, this.scaleY);
        if(this.rotation) context.rotate(this.rotation);
        context.drawImage(data.src, data.x, data.y, data.w, data.h, -(data.w/2), -(data.h / 2), data.w, data.h);
    }
}