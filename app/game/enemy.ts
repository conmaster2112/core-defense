import { DrawableShapesPaths } from "../drawable";
import { CustomVisual } from "../drawable/custom-visual";
import { Entity } from "../entities";
import type { Game } from "./game";

export class Enemy extends Entity {
    public health: number = 200;
    public damage: number = 200;
    public constructor(public readonly game: Game){
        super();
        const g = 0;
        this.visual = new CustomVisual((c)=>{
            c.rotate(Math.PI * 2 * Math.random());
            c.stroke(DrawableShapesPaths.anyGonPaths[2 + Math.ceil(g + 3*Math.random())]);
        });
    }
}