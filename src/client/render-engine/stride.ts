import { Vec2 } from "../math";
import { BaseRenderLoop } from "./game-loop";

export abstract class Stride {
    public velocity: Vec2 = new Vec2(0, 0);
    public position: Vec2 = new Vec2(0, 0);
    public tick(): void{
        this.position = this.position.add(this.velocity);
    }
    public render(rLoop: BaseRenderLoop): Vec2{
        return rLoop._precomputed.multiply(this.position.add(this.velocity.multiplyS(rLoop.__delta)));
    }
}