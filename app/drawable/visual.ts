import { Vec2 } from "../math";
import { Animation } from "./animation";
import { Drawable } from "./drawable";

interface VisualAnimationState {
    endTimeDelta: number;
    animation: Animation;
    res: ()=>void
}

export abstract class Visual extends Drawable {
    protected readonly animations: Set<VisualAnimationState> = new Set();
    public async playAnimation(animation: Animation, duration: number): Promise<void>{
        return new Promise<void>(res=>this.animations.add({
            animation,
            endTimeDelta: (1/(performance.now() + duration)),
            res
        }));
    }
    protected __render__(context: CanvasRenderingContext2D): void { this.draw(context); }
    protected abstract __draw__(context: CanvasRenderingContext2D): void;
    public draw(context: CanvasRenderingContext2D, time: number = performance.now()): void {
        for(const a of this.animations)
        {
            const d = time * a.endTimeDelta;
            if(d > 1) {
                this.animations.delete(a);
                a.res();
                continue;
            }

            a.animation.apply(context, d);
        }
        this.__draw__(context);
    }
}
/*

    public reset(startTime: number = performance.now()): void {
        this.endTimeDelta = 1 / ((this.startTime = startTime) + this.duration);
    }
    public endTimeDelta;
    public getDelta(time = performance.now()): number{return time * this.endTimeDelta; }
    public constructor(public readonly duration: number, public startTime = performance.now()){
        super();
        this.endTimeDelta = 1 / (this.startTime + duration);
    }
*/