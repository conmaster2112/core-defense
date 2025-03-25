import { CustomVisual } from "../drawable";
import { Entity } from "../entities";
import { Enemy } from "./enemy";

export class Projectile extends Entity {
    public target: Enemy | null = null;
    public damage = 10;
    public constructor(){
        super();
        this.visual = new CustomVisual((c)=>{
            const {x, y} = this.velocity.normalize();
            c.rotate(Math.atan2(y, x) - Math.PI / 2);
            //c.strokeRect(-10,-10,20,20);
            c.fillRect(-5, -20, 10, 40);
            //c.stroke(DrawableShapesPaths.anyGonPaths[2 + Math.ceil(g + 3*Math.random())]);
        });
    }
}