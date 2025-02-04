import { Game } from "../game";
import { Vec2 } from "../math";
import type { Stride } from "./stride";

export class BaseRenderLoop {
    public readonly context;
    public readonly tickDelta: number;
    public readonly models = new Set<Stride>();
    public scale: Vec2;
    public ratio: Vec2;
    public _precomputed: Vec2;
    public _precomputed_delta: Vec2;
    public __delta = 1;
    public __deltaPrediction = 1;
    protected tickTime = performance.now();
    protected fps = 0;
    protected fpsCounter = 0;
    public constructor(public readonly game: Game, public readonly tickSpeed: number, public readonly useDelta = true, deltaPredication = 1){
        this.tickDelta = 1 / tickSpeed;
        this.context = game.renderEngine;
        this.scale = game.ui.scale;
        this.ratio = game.ui.ratio;
        this.__delta = useDelta?1:0;
        this.__deltaPrediction = deltaPredication;
        this._precomputed = Vec2.multiply(this.scale, this.ratio);
        this._precomputed_delta = Vec2.multiplyS(this._precomputed, this.__delta);
    }
    public tick(): void{
        this._precomputed = Vec2.multiply(this.scale, this.ratio);
        for(const stride of this.models) stride.tick();
        this.tickTime =  performance.now(); 
    }
    public render(): void{
        if(this.useDelta) this.__delta = ((performance.now() - this.tickTime) * this.tickDelta)*this.__deltaPrediction;
        this._precomputed = Vec2.multiply(this.scale, this.ratio);
        this._precomputed_delta = Vec2.multiplyS(this._precomputed, this.__delta);
        for(const stride of this.models) stride.render(this);
        this.fpsCounter++;
    }
}