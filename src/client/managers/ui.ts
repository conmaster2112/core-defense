import { ElementIds } from "../element-id";

export class UIManager {
    public static getElement<T extends HTMLElement>(id: string): T{
        const e = document.getElementById(id);
        if(!e) throw new ReferenceError("Failed to get element with id of " + id);
        return e! as T;
    }
    public readonly canvasElement;
    public readonly titleElement;
    public readonly bodyElement: HTMLBodyElement;
    public readonly context: CanvasRenderingContext2D;
    public clientWidth: number = 0;
    public clientHeight: number = 0;
    public constructor(){
        this.canvasElement = UIManager.getElement<HTMLCanvasElement>(ElementIds.ViewportCanvas);
        this.titleElement = UIManager.getElement<HTMLTitleElement>(ElementIds.WindowTitle);
        this.bodyElement = document.body! as HTMLBodyElement;
        this.context = this.canvasElement.getContext("2d")!;
        if(!this.context)
            throw new ReferenceError("Failed to get context from canvas");

        this.title = "PacMan lite"
        window.addEventListener("resize", ()=>this.__update());
        this.__update();
    }
    public get title(): string{return this.titleElement.textContent!;}
    public set title(v: string){ this.titleElement.textContent = v;}
    public get canvasWidth(): number{return this.canvasElement.width;}
    public get canvasHeight(): number{return this.canvasElement.height;}
    protected __update(): void{
        this.clientWidth  = this.bodyElement.clientWidth;
        this.clientHeight = this.bodyElement.clientHeight;
    }
    public close(): void {window.close();}
    public setWindowSize(width: number, height: number): void{window.resizeTo(width, height);}
    public newCanvas(): HTMLCanvasElement
    {return document.createElement("canvas")!;}
}
export const ui = new UIManager();