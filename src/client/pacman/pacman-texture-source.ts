import { TextureRawData, TextureSource } from "../texture";

export class PacManTextureSource extends TextureSource {
    public currentFrame: number = 0;
    public isAngry: boolean = false;
    public constructor(public angryTexture: TextureSource, public texture: TextureSource){super();}
    public getTextureData(): TextureRawData {
        if(this.isAngry) return this.angryTexture.getTextureData();
        return this.texture.getTextureData();
    }
}