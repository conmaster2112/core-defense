import { Visual } from "./visual";

export class CustomVisual extends Visual {
    public constructor(public callable: (context: CanvasRenderingContext2D)=>void){
        super();
    }
    protected __draw__(context: CanvasRenderingContext2D): void {
        this.callable(context);
    }
}