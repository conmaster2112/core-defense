import { AnimationFunction } from "./state";
import { AnimationVisualProperty } from "./visual-property";

export class Animation {
    public readonly properties: AnimationVisualProperty[];
    public constructor(public readonly func: AnimationFunction, ...properties: AnimationVisualProperty[]){
        this.properties = properties;
    }
    public apply(context: CanvasRenderingContext2D, baseDelta: number): void{
        const d = this.func.pass(baseDelta);
        for(let i = 0; i < this.properties.length; i++) this.properties[i].apply(context, d);
    }
}