import { Visual } from "../drawable";
import { TextureRawData } from "./texture-data";

export abstract class TextureSource extends Visual {
    public abstract getTextureData(): TextureRawData;
    protected __draw__(context: CanvasRenderingContext2D): void {
        const data = this.getTextureData();
        context.drawImage(data.src, data.x, data.y, data.w, data.h, -(data.w / 2), -(data.h / 2), data.w, data.h);
    }
}