import { Vec2 } from "../math";
import { uiManager } from "../managers";
import { DrawableShapesPaths } from "../drawable";
import { Utils } from "../utils";
import { Enemy } from "./enemy";
import { Projectile } from "./projectile";

type DynamicEnemy = {
    __distance__: number;
}

export class Game {
    public constructor(public readonly context: CanvasRenderingContext2D) {}
    public optionsResolution = 1024;
    public optionsShowStats = false;
    public optionsUseDelta = true;
    public optionsTickTime: number = 200;
    protected __delta = 1;
    protected __deltaPrediction = 1;
    protected tickUpTime = performance.now();
    protected fpsIncrement = 0;
    protected fpsCount = 0;
    protected fpsTimestamp = 0;
    public currentTick = 0;

    // Core
    public forceFieldRadius = 500;
    public coreRadius = 75;
    public coreHealth = 580;
    public maxCoreHealth = 580;

    // Enemy
    protected enemyRadius = 40;
    protected readonly enemies: Set<Enemy> = new Set();
    protected readonly projectiles: Set<Projectile> = new Set();
    public async start(): Promise<void> {
        const canvas = uiManager.canvasElement;
        canvas.height = canvas.width = this.optionsResolution;
        
        // Reset events
        this.currentTick = 0;
        
        this.renderLoop();
        this.tick();
    }
    protected tickEnemies(): void{
        let targetEnemy: Enemy | null = null;
        let targetEnemyDistance: number = Infinity;

        let __cacheSaveRadius = this.coreRadius + this.enemyRadius;


        for(const enemy of this.enemies) {
            // Update position
            const newPosition = enemy.position.add(enemy.velocity);

            // Check distance
            const distance = enemy.position.magnitude();
            (enemy as unknown as DynamicEnemy)["__distance__"] = distance;

            // Enemy hits the core
            if(distance <= __cacheSaveRadius) {
                this.coreHealth--;
                this.enemies.delete(enemy);
            }

            // Core in danger enemy
            if(distance < targetEnemyDistance) {
                targetEnemy = enemy;
                targetEnemyDistance = distance;
            }




            let newVelocity =  enemy.velocity.add(enemy.position.normalize().multiplyS(-2.8));
            newVelocity = newVelocity.add(Vec2(newVelocity.y, -newVelocity.x).multiplyS(0.08));
            if(newVelocity.magnitude() > 10) {
                newVelocity = newVelocity.normalize().multiplyS(10);
            }
            
            enemy.velocity = newVelocity;
            enemy.position = newPosition;
        }
    }

    protected async tick(): Promise<void> {
        this.tickEnemies();

        if(this.currentTick % 5 === 0)
        for(let i = 0; i < 1; i++){
            const entity = new Enemy(this);
            entity.position = Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyS(1000);
            entity.rotation = Math.PI * 2 * Math.random();
            entity.velocity = entity.position.multiplyS(-0.01);
            entity.scaleX = entity.scaleY = this.enemyRadius;
            //Utils.delay(40_000).then(()=>this.enemies.delete(entity));
            this.enemies.add(entity);
        }

        if(this.currentTick % 5 === 0) 
        {
            const projectile = new Projectile();
            this.enemies.add(projectile as Enemy);
            projectile.position = Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyS(1000);
            const {x,y} = projectile.velocity = projectile.position.multiplyS(-0.03);
            //Utils.delay(30_000).then(()=>this.enemies.delete(projectile as Enemy));
            projectile.velocity = projectile.velocity.add(Vec2(y, -x));
        }

        //End of the tick
        this.currentTick++;
    }
    protected getStats(): string {
        return `FPS: ${this.fpsCount}, RES: ${this.optionsResolution}x${this.optionsResolution}, D: ${this.__delta.toFixed(2)}, TICK: ${this.currentTick}, ENTITIES: ${this.enemies.size}`;
    }
    protected async renderLoop(): Promise<void> {
        let now = performance.now(), difference = now - this.tickUpTime;

        if(difference > this.optionsTickTime){
            this.tickUpTime = now;
            difference = 0;
            this.tick();
        }

        if (now - this.fpsTimestamp > 1000) {
            this.fpsCount = this.fpsIncrement;
            this.fpsIncrement = 0;
            this.fpsTimestamp = now;
        }
        const context = this.context;
        (context as any).__delta__ = this.__delta = difference / this.optionsTickTime;
        const scale = new Vec2(uiManager.clientHeight, uiManager.clientWidth).normalize();

        // Reset before drawing!
        context.reset();
        // Default options
        context.textRendering = "optimizeSpeed";

        // Show stats
        if (this.optionsShowStats) {
            context.save();

            context.fillStyle = "#9999";
            context.textAlign = "start";
            context.textBaseline = "top";
            // get new scale
            context.scale(scale.x * 3.2, scale.y * 3);
            context.fillText(this.getStats(), 4, 4);

            context.restore();
        }

        // Initialize base rendering context
        // Translate to middle
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        // get new scale
        context.scale(scale.x, scale.y);


        // Render Background
        this.renderForceField();
        // Render Entities
        
        context.strokeStyle = "#6699ff";
        context.fillStyle = "#b38"
        context.lineWidth = 0.1;
        for(const enemy of this.enemies) enemy.render(context);
        // Render Bullets
        // Render Basement
        this.renderCore();
        // Render Particles

        this.fpsIncrement++;

        //context.scale(4,4);
        //test(context, 5, 80);

        //await Utils.delay(50);
        requestAnimationFrame(() => this.renderLoop());
    }
    protected renderForceField(): void{
        const {context, forceFieldRadius} = this;
        context.save();
        context.scale(forceFieldRadius, forceFieldRadius)
        context.strokeStyle = "#8899ff99";
        context.lineWidth = 3/forceFieldRadius;
        context.fillStyle = "#8899ff08"
        context.stroke(DrawableShapesPaths.circle);
        context.fill(DrawableShapesPaths.circle);
        context.strokeStyle = "#fff8";
        context.lineWidth = 1 / forceFieldRadius;
        context.stroke(DrawableShapesPaths.circle);
        context.restore();
    }
    protected renderCore(): void{
        const stability = this.coreHealth / this.maxCoreHealth, context = this.context, shapeStability = 4 + 10 * stability;
        const reverseStability = 1 - stability;

        context.save();
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle"
        context.scale(2,2);
        context.fillText((stability * 100).toFixed(1) + "%", 0, 0);
        context.restore();
        context.save();

        context.scale(this.coreRadius, this.coreRadius);
        for(let i = 0; i < 1 +reverseStability * 5; i++) {
            context.save();
            context.rotate(Math.random() * Math.PI * 2);
            const scale = Math.random() * reverseStability * 0.5;
            context.scale(1 + scale, 1 + scale);
            const shape = DrawableShapesPaths.anyGonPaths[~~(shapeStability + Math.random() * 2)];
            context.strokeStyle = `#fff`;
            context.lineWidth = 1 / this.coreRadius;
            context.stroke(shape);
            context.strokeStyle = `rgb(${50 + reverseStability * 155}, 50, ${100 + stability * 155})`;
            context.lineWidth = 3/this.coreRadius;
            context.fillStyle = "#2042"
            context.stroke(shape);
            context.fill(shape);
            context.restore();
        }

        context.restore();
    }
}