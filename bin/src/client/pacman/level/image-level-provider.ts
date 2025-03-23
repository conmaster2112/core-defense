import { TextureReader } from "../../../../../app/texture";
import { Utils } from "../../../../../app/utils";
import { LevelProvider } from "./level-provider";

export class ImageLevelProvider extends LevelProvider{
    public readonly data;
    public readonly reader;
    public constructor(img: HTMLImageElement){
        super(img.width, img.height);
        this.data = Utils.readImageData(img);
        this.reader = new TextureReader(this.data.data.buffer, this.w, this.h);
    }
    public getAvailability(x: number, y: number): number {
        return this.reader.getPixelColor(x, y);
    }
}