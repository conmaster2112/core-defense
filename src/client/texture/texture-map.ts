import { Utils } from "../utils";
import { FrameTexture } from "./texture-frame";
import { Texture } from "./texture";

export class TextureMap extends Texture {
    public constructor(public readonly src: HTMLImageElement){
        super(src, 0, 0, src.width, src.height);
    }
    public getTexture(x: number, y: number, w: number, h: number): Texture{
        return new Texture(this.src, this.x + x, this.y + y, w, h);
    }
    public getFrameTexture(x: number, y: number, w: number, h: number, frames: number): FrameTexture{
        const frameTexture = new FrameTexture();
        for(let i = 0; i < frames; i ++) frameTexture.addFrame(this.src, this.x + x + i*w, y, w, h);
        return frameTexture;
    }
    public static async FromSrc(str: string): Promise<TextureMap>{
        const img = await Utils.fetchImage(str);
        return new TextureMap(img);
    }
}