
export class Utils {
    private constructor(){}
    public static isDebug = true;
    public static readImageData(img: HTMLImageElement): ImageData{
        const cv = document.createElement("canvas");
        const ct = cv.getContext("2d")!;
        cv.width = img.width;
        cv.height = img.height;
        ct.imageSmoothingEnabled = false;
        ct.drawImage(img, 0, 0);
        return ct.getImageData(0,0, cv.width, cv.height);
    }
    public static async fetchImage(src: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = src;
        await new Promise((r)=>img.addEventListener("load", r, {once: true}));
        return img;
    }
    public static delay(time: number): Promise<void>{ return new Promise(res=>setTimeout(res, time)); }
    public static recompute(canvas: HTMLCanvasElement, mapper: (buffer: ArrayBuffer | SharedArrayBuffer, w: number, h: number)=>void): void{
        const src = canvas.getContext("2d")!.getImageData(0,0, canvas.width, canvas.height);
        mapper(src.data.buffer, src.width, src.height);
        canvas.getContext("2d")!.putImageData(src, 0, 0);
    }
}