import { Utils } from "../utils";

export class TextureReader {
    public readonly buffer;
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, public readonly width: number, public readonly height: number){
        this.buffer = new Uint32Array(buffer);
    }
    public getPixelColor(x: number, y: number): number{
        if(x < 0 || x >= this.width) return -1;
        if(y < 0 || y >= this.height) return -1;
        return this.buffer[y*this.width + x];
    }
    public static From(src: ImageData): TextureReader{
        return new this(src.data.buffer, src.width, src.height);
    }
    public static async FromSrc(str: string): Promise<TextureReader> {
        const img = await Utils.fetchImage(str);
        const {data, height, width}= Utils.readImageData(img);
        return new TextureReader(data.buffer, width, height);
    }
}