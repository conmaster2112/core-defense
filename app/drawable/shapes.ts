const {PI, sin, cos} = Math;
const PIx2 = PI * 2;
export class DrawableShapesFunctions {
    private constructor(){}
    public static circlePath(context: CanvasPath, radius: number = 1): void{
        // Draw the circle
        context.arc(0, 0, radius, 0, PIx2);
    }
    public static anyGonPath(context: CanvasPath, gonLevel: number, size: number = 1): void {
        const rad = PIx2 / gonLevel;
        for (let i = 0; i <= gonLevel; i++) {
          const angle = i * rad;
          const dx = size * cos(angle);
          const dy = size * sin(angle);
          if (i === 0) context.moveTo(dx, dy);
          else context.lineTo(dx, dy);
        }
    }
}

export class DrawableShapesPaths {
    private constructor(){}
    public static readonly anyGonPaths: Record<number,Path2D> & {max: number, min: number} = {min: 2, max: 30};
    public static readonly triangle: Path2D = this.anyGonPaths[3] ??= new Path2D();
    public static readonly rectangle: Path2D = this.anyGonPaths[4] ??= new Path2D();
    public static readonly pentagon: Path2D = this.anyGonPaths[5] ??= new Path2D();
    public static readonly hexagon: Path2D = this.anyGonPaths[6] ??= new Path2D();
    public static readonly circle: Path2D = new Path2D();
    static {
        const p = this.anyGonPaths;
        for(let i = p.min; i < p.max; i++) {
            DrawableShapesFunctions.anyGonPath(p[i] ??= new Path2D(), i);
            p[i].closePath();
        }
        this.circle.arc(0, 0, 1, 0, PIx2);
        this.circle.closePath();
    }
}