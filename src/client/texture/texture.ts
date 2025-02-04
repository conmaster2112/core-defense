import { TextureRawData } from "./texture-data";
import { TextureSource } from "./texture-source";

export class Texture extends TextureSource implements TextureRawData{
    public constructor(
        public readonly src: CanvasImageSource, 
        public x: number,
        public y: number,
        public w: number,
        public h: number
        ){
        super();
    }
    public getTextureData(): TextureRawData {return this;}
}