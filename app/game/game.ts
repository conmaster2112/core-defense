import { Vec2 } from "../math";
import { DrawableShapesPaths } from "../drawable";
import { Enemy } from "./enemy";
import { Projectile } from "./projectile";
import { UIManager } from "../managers";
import { GameProperties } from "./properties";
import { Utils } from "../utils";
import { BaseInfo, INFINITY_LEVEL, LEVELS } from "./level";

export class Game {
    private gameProperties = new GameProperties();
    private keepRendering = false;
    public constructor(public readonly context: CanvasRenderingContext2D) {}
    public optionsResolution = 1024;
    public optionsShowStats = false;
    public optionsUseDelta = true;
    public optionsTickTime: number = 60;
    protected __delta = 1;
    protected __deltaPrediction = 1;
    protected tickUpTime = performance.now();
    protected fpsIncrement = 0;
    protected fpsCount = 0;
    protected fpsTimestamp = 0;
    public currentTick = 0;
    public levelInProgress: Iterator<void> | null = null;

    // Base
    public baseScale = 0.8;

    // Core
    public forceFieldRadius = 500;
    public coreRadius = 75;
    public coreHealth = 80;
    public maxCoreHealth = 580;
    public maxReward = 150;
    public minReward = 50;

    // Enemy
    protected enemyHitBox = 40;
    protected projectilesToSpawn = 0;
    protected maxEnemySpeed = 2;
    protected enemyHealth = 50;
    protected enemyDamage = 10;
    // Projectiles
    protected maxProjectileSpeed = 35;
    protected projectileHitBox = 40;

    protected readonly enemies: Set<Enemy> = new Set();
    protected readonly activeEnemies: Set<Enemy> = new Set();

    //protected readonly dangerous_enemies: Set<Enemy> = new Set();
    protected readonly projectiles: Set<Projectile> = new Set();
    public async showTitle(title: string, timeout: number): Promise<void>{
        UIManager.gameTitle.textContent = title;
        UIManager.gameTitle.style.display = "block";
        await Utils.delay(timeout);
        UIManager.gameTitle.style.display = "none";
    }
    public * levelRunner(level: IterableIterator<BaseInfo | number>): Generator<void>{
        for(const info of level){
            if(typeof info === "number") {
                if(info < 0) while(this.enemies.size) yield;
                for(let i = 0; i < info; i++) yield;
            }
            else this.spawnEnemy(info);
        }
    }
    public async onEnd(): Promise<void>{
        await Utils.delay(500);
        this.context.reset();
        if(this.coreHealth <= 0)
            await this.showTitle("You failed to pass this level!", 2000);
        else
        {
            this.gameProperties.level++;
            await this.showTitle("Level Passed!", 2000);
            this.gameProperties.electrons += this.gameProperties.level*2*100;
        }
        this.start();
    }
    public async start(): Promise<void> {
        if(this.gameProperties.level > LEVELS.length){
            this.gameProperties.level = LEVELS.length + 1;
        }
        await this.showTitle("Level " + (this.gameProperties.level > LEVELS.length?"Impossible":this.gameProperties.level), 3000);
        this.levelInProgress = this.levelRunner(LEVELS[this.gameProperties.level - 1]?.()??INFINITY_LEVEL());
        const canvas = UIManager.canvasElement;
        canvas.height = canvas.width = this.optionsResolution;
        this.forceFieldRadius = this.gameProperties.attackRangeValue + this.coreRadius;
        this.coreHealth = this.maxCoreHealth = this.gameProperties.maxHealthValue;
        this.baseScale = 400/this.forceFieldRadius;
        this.enemies.clear();
        this.activeEnemies.clear();
        this.projectiles.clear();
        
        // Reset events
        this.currentTick = 0;
        
        this.keepRendering = true;
        this.renderLoop();
        this.tick();
    }
    protected enemyKill(enemy: Enemy): void{
        this.enemies.delete(enemy);
        this.activeEnemies.delete(enemy);
    }
    protected allEnemyTick(): Enemy | null{
        const __cR__ = this.coreRadius + this.enemyHitBox;
        let targetEnemy: Enemy | null = null, _targetEnemyDistance = Infinity;

        for(const enemy of this.enemies) {
            // Update position
            const _pos = enemy.position = enemy.position.add(enemy.velocity);
            let maxEnemySpeed = this.maxEnemySpeed * enemy.maxSpeedAmplifier;

            // Check distance
            const distance = _pos.magnitude();

            // Enemy hits the core
            if(distance <= __cR__) {
                this.coreHealth -= enemy.damage;
                this.enemyKill(enemy);
            }

            // Is inside of force field
            if(distance <= this.forceFieldRadius) {
                maxEnemySpeed *= 0.8;
                if(enemy.abstractHealth > 0){ 
                    this.activeEnemies.add(enemy);
                    // Check for enemy distance
                    if(distance < _targetEnemyDistance) {
                        targetEnemy = enemy;
                        _targetEnemyDistance = distance;
                    }
                }
            }

            let newVelocity =  enemy.velocity.add(_pos.normalize().multiplyS(-maxEnemySpeed));
            if(newVelocity.magnitude() > maxEnemySpeed) {
                newVelocity = newVelocity.normalize().multiplyS(maxEnemySpeed);
            }
            
            enemy.velocity = newVelocity;
        }

        return targetEnemy;
    }

    protected allProjectileTick(): void {
        const _minDistance = this.projectileHitBox + this.enemyHitBox;
        for(const projectile of this.projectiles) {

            // Update position
            const _pos = projectile.position = projectile.position.add(projectile.velocity);
            const target = projectile.target;

            // Check for target validity
            if(!target || !this.enemies.has(target)) {
                this.projectiles.delete(projectile);
                continue;
            }

            const relativeVec = projectile.position.subtract(target.position);

            // Check distance
            const distance = relativeVec.magnitude();
            if(distance <= _minDistance) {
                // Break projectile
                this.projectiles.delete(projectile);

                // Kill enemy if damage is zero
                if((target.health -= projectile.damage) <= 0) {
                    this.gameProperties.electrons += ~~((this.maxReward-this.minReward)*Math.random() + this.minReward);
                    this.enemyKill(target);
                }

                target.velocity = target.velocity.add(projectile.velocity.multiplyS(0.3));

                // No other calls in-need
                continue;
            }

            let newVelocity = projectile.velocity.add(relativeVec.normalize().multiplyS(-this.maxProjectileSpeed));
            if(newVelocity.magnitude() > this.maxProjectileSpeed) {
                newVelocity = newVelocity.normalize().multiplyS(this.maxProjectileSpeed);
            }
            
            projectile.velocity = newVelocity;
        }
    }
    protected spawnProjectile(target: Enemy): Projectile{
        const projectile = new Projectile();
        projectile.damage = this.gameProperties.damageValue;
        projectile.target = target;
        this.projectiles.add(projectile);
        this.projectilesToSpawn--;
        if((target.abstractHealth -= projectile.damage) <= 0) this.activeEnemies.delete(target);
        return projectile;
    }
    protected spawnEnemy(baseInfo: BaseInfo): void{
        const entity = new Enemy(this);
        entity.position = Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyS(this.forceFieldRadius + this.enemyHitBox * 5);
        entity.rotation = Math.PI * 2 * Math.random();
        entity.velocity = entity.position.multiplyS(-0.01);

        entity.scaleX = entity.scaleY = this.enemyHitBox * baseInfo.level;
        entity.damage = this.enemyDamage * baseInfo.level;
        entity.health = entity.abstractHealth = this.enemyHealth * baseInfo.level;
        entity.maxSpeedAmplifier = this.maxEnemySpeed / baseInfo.level;
        console.log(baseInfo.level);
        this.enemies.add(entity);
    }
    protected async tick(): Promise<void> {
        const newTarget = this.allEnemyTick();
        this.allProjectileTick();

        const {done} = this.levelInProgress?.next()??{};

        if(newTarget && this.projectilesToSpawn >= 1)
            this.spawnProjectile(newTarget);

        if(this.projectilesToSpawn < this.gameProperties.bulletStackValue) {
            this.projectilesToSpawn += this.gameProperties.attackSpeedValue;
        }

        this.forceFieldRadius = this.gameProperties.attackRangeValue + this.coreRadius;
        this.baseScale = 400/this.forceFieldRadius;

        //End of the tick
        this.currentTick++;

        if(this.coreHealth <= 0 || done) {
            this.keepRendering = false;
            this.onEnd();
        }
    }
    protected getStats(): string {
        return `FPS: ${this.fpsCount}, RES: ${this.optionsResolution}x${this.optionsResolution}, D: ${this.__delta.toFixed(2)}, TICK: ${this.currentTick}, EE: ${this.enemies.size}, EPR: ${this.projectiles.size}, STACK: ${this.projectilesToSpawn.toFixed(2)}`;
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
        const scale = new Vec2(UIManager.clientHeight, UIManager.clientWidth).normalize();

        // Reset before drawing!
        context.reset();
        // Default options
        context.textRendering = "optimizeSpeed";

        // Show stats
        if (this.optionsShowStats) {
            context.save();

            context.fillStyle = "#9994";
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
        context.scale(this.baseScale, this.baseScale);


        // Render Background
        this.renderForceField();
        // Render Entities
        
        context.strokeStyle = "#6699ff";
        context.fillStyle = "#baf"
        context.lineWidth = 0.1;
        for(const enemy of this.enemies) enemy.render(context);
        for(const projectile of this.projectiles) projectile.render(context);
        // Render Bullets
        // Render Basement
        this.renderCore();
        // Render Particles

        this.fpsIncrement++;

        //context.scale(4,4);
        //test(context, 5, 80);

        //await Utils.delay(50);
        if(this.keepRendering) requestAnimationFrame(() => this.renderLoop());
        else if(this.coreHealth<=0){
            context.reset();
            context.textRendering = "optimizeSpeed";
            // Initialize base rendering context
            // Translate to middle
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            // get new scale
            context.scale(scale.x, scale.y);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.strokeStyle = "#ff3344"
            context.fillStyle = "#0004";
            context.scale(15 / this.baseScale, 15 / this.baseScale);
            context.fillRect(-40,-6,80,14);
            context.strokeText("GAME OVER", 0, 0);
            context.scale(0.3, 0.3);
            context.strokeText("Reactor Exploded", 0, 18);
        }
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