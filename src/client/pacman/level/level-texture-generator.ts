import { ui } from "../../managers";
import { TextureRawData, TextureSource } from "../../texture";
import { Resources } from "../resources";
import { LevelProvider } from "./level-provider";

export class LevelTextureGenerator extends TextureSource {
    public readonly src = ui.newCanvas();
    public readonly x = 0;
    public readonly y = 0;
    public get h(): number { return this.src.height; }
    public get w(): number { return this.src.width; }
    public getTextureData(): TextureRawData {return this;}
    private constructor(public readonly scale: number){super();}
    public static generate(provider: LevelProvider, resources: Resources, scale: number = 8): LevelTextureGenerator{
        const gen = new this(scale);
        const   canvas = gen.src, 
                context = canvas.getContext("2d")!,
                textureSet = resources.collisionTextureSet;
        
        canvas.style.backgroundColor = "transparent";
        context.fillStyle = "transparent";
        context.reset();
        const { w: sw, h: sh } = provider;
        canvas.width = sw * scale;
        canvas.height = sh * scale;
        context.imageSmoothingEnabled = false;
        for (let x = 0; x < sw; x++)
            for (let y = 0; y < sh; y++) {
                if (provider.getAvailability(x, y)) {
                    Resources.prototype.textureMap
                    const data = (textureSet[provider.getBitMaskFor(x, y)] ?? textureSet[0]).getTextureData();
                    ui.context.imageSmoothingEnabled = false;
                    context.drawImage(data.src, data.x, data.y, data.w, data.h, x * scale, y * scale, scale, scale);
                }
            }
        return gen;
    }
    /*
        public readonly canvas = document.createElement("canvas");
        public readonly src: CanvasImageSource = this.canvas;
        public readonly context = this.canvas.getContext("2d")!;
        public readonly x = 0;
        public readonly y = 0;
        public get h(): number { return this.canvas.height; }
        public get w(): number { return this.canvas.width; }
        public constructor(public readonly reader: TextureReader) {
            super();
        }
        public generate(textureSet: Record<number, TextureSource>): void {
            this.canvas.style.backgroundColor = "transparent";
            this.context.fillStyle = "transparent";
            this.context.reset();
            const { width: sw, height: sh } = this.reader;
            const multiplier = 32;
            this.canvas.width = sw * multiplier;
            this.canvas.height = sh * multiplier;
            this.context.imageSmoothingEnabled = false;
            for (let x = 0; x < sw; x++)
                for (let y = 0; y < sh; y++) {
                    if (this.reader.getPixelColor(x, y)) {
                        console.log(this.__strength(x, y).toString(2))
                        const data = (textureSet[this.__strength(x, y)] ?? textureSet[0]).getTextureData();
                        this.context.drawImage(data.src, data.x, data.y, data.w, data.h, x * multiplier, y * multiplier, multiplier, multiplier);
                    }
                }
        }
        public getRawData(): Uint8ClampedArray{
            return this.context.getImageData(0,0,this.canvas.width, this.canvas.height).data;
        }
        public setRawData(buffer: Uint8ClampedArray): void{
            const {width, height} = this.canvas;
            const data = new ImageData(this.w, this.h, {colorSpace:"srgb"});
            data.data.set(buffer);
            return this.context.putImageData(data, 0, 0);
        }
        protected __strength(x: number, y: number): number {
            const v =
                ((this.reader.getPixelColor(x, y - 1) ? 1 : 0) << 0) |
                ((this.reader.getPixelColor(x + 1, y - 1)  ? 1 : 0) << 1) |
    
                ((this.reader.getPixelColor(x + 1, y)  ? 1 : 0) << 2) |
                ((this.reader.getPixelColor(x + 1, y + 1)  ? 1 : 0) << 3) |
    
                ((this.reader.getPixelColor(x, y + 1)  ? 1 : 0) << 4) |
                ((this.reader.getPixelColor(x - 1, y + 1)  ? 1 : 0) << 5) |
    
                ((this.reader.getPixelColor(x - 1, y)  ? 1 : 0) << 6) |
                ((this.reader.getPixelColor(x - 1, y - 1) ? 1 : 0) << 7);
            return v;
        }
        public getTextureData(): TextureRawData { return this; }*/
}