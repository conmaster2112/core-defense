import { TextureSource } from "../../../../../app/texture";
import { Entity } from "./entity";

export class PacMan<T extends TextureSource> extends Entity<T> {
    public constructor(texture: T){
        super(5, texture);
    }
    public update(context: CanvasRenderingContext2D): void {
        context.translate(-this.position.x, -this.position.y);
        super.update(context);
    }
}