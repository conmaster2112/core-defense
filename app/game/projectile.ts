import { CustomVisual } from "../drawable";
import { Entity } from "../entities";

export class Projectile extends Entity {
    public constructor(){
        super();
        const g = 0;
        this.visual = new CustomVisual((c)=>{
            const {x, y} = this.velocity.normalize();
            c.rotate(Math.atan2(y, x) - Math.PI / 2);
            //c.strokeRect(-10,-10,20,20);
            c.fillRect(-5, -20, 10, 40);
            //c.stroke(DrawableShapesPaths.anyGonPaths[2 + Math.ceil(g + 3*Math.random())]);
        });
    }
}