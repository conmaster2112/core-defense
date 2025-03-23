import { TextureRawData, TextureSource } from "../../../../../app/texture";
import { Stride } from "./stride";

export class Entity<T extends TextureSource> extends Stride {
    public constructor(radius: number, public texture: T){
        super(radius);
    }
    public getTextureData(): TextureRawData { return this.texture.getTextureData(); }
}