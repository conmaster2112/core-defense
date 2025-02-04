import { TextureSource } from "./texture-source";
import { TextureRawData } from "./texture-data";

export class FrameTexture extends TextureSource {
    public readonly frames: TextureRawData[] = [];
    public currentFrame = 0;
    public addFrame(src: CanvasImageSource, x: number, y: number, w: number, h: number): void{
        this.frames.push({src: src, x, y, w, h});
    }
    public addFrameData(data: TextureRawData): void{
        this.frames.push(data);
    }
    public getTextureData(frame?: number): TextureRawData { return this.frames[(frame??this.currentFrame)%this.frames.length]; }
}