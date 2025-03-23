
//#region app/math/vec2.ts
const sP = Object.setPrototypeOf;
const Vec2 = function Vec2$1(x, y) {
	return sP({
		x,
		y
	}, new.target?.prototype ?? Vec2$1.prototype);
};
Vec2.add = function add(vec1, vec2) {
	return sP({
		x: vec1.x + vec2.x,
		y: vec1.y + vec2.y
	}, Vec2.prototype);
};
Vec2.addS = function addS(vec1, scalar) {
	return sP({
		x: vec1.x + scalar,
		y: vec1.y + scalar
	}, Vec2.prototype);
};
Vec2.prototype.add = function add(vec) {
	return Vec2.add(this, vec);
};
Vec2.prototype.addS = function addS(scalar) {
	return Vec2.addS(this, scalar);
};
Vec2.subtract = function subtract(vec1, vec2) {
	return sP({
		x: vec1.x - vec2.x,
		y: vec1.y - vec2.y
	}, Vec2.prototype);
};
Vec2.subtractS = function subtractS(vec1, scalar) {
	return sP({
		x: vec1.x - scalar,
		y: vec1.y - scalar
	}, Vec2.prototype);
};
Vec2.prototype.subtract = function subtract(vec) {
	return Vec2.subtract(this, vec);
};
Vec2.prototype.subtractS = function subtractS(scalar) {
	return Vec2.subtractS(this, scalar);
};
Vec2.multiplyS = function multiply(vec, scalar) {
	return sP({
		x: vec.x * scalar,
		y: vec.y * scalar
	}, Vec2.prototype);
};
Vec2.prototype.multiply = function multiply(vec) {
	return Vec2.multiply(this, vec);
};
Vec2.multiply = function multiply(vec, vec2) {
	return sP({
		x: vec.x * vec2.x,
		y: vec.y * vec2.y
	}, Vec2.prototype);
};
Vec2.prototype.multiplyS = function multiply(scalar) {
	return Vec2.multiplyS(this, scalar);
};
Vec2.divide = function divide(vec, scalar) {
	return sP({
		x: vec.x / scalar,
		y: vec.y / scalar
	}, Vec2.prototype);
};
Vec2.prototype.divide = function divide(scalar) {
	return Vec2.divide(this, scalar);
};
Vec2.dotProduct = function dotProduct(vec1, vec2) {
	return vec1.x * vec2.x + vec1.y * vec2.y;
};
Vec2.prototype.dotProduct = function dotProduct(vec) {
	return Vec2.dotProduct(this, vec);
};
Vec2.reflect = function reflect(vec, normal) {
	const dotProduct = Vec2.dotProduct(vec, normal);
	return sP({
		x: vec.x - 2 * dotProduct * normal.x,
		y: vec.y - 2 * dotProduct * normal.y
	}, Vec2.prototype);
};
Vec2.prototype.reflect = function reflect(normal) {
	return Vec2.reflect(this, normal);
};
Vec2.magnitude = function magnitude(vec) {
	return Math.sqrt(vec.x ** 2 + vec.y ** 2);
};
Vec2.prototype.magnitude = function magnitude() {
	return Vec2.magnitude(this);
};
Vec2.normalize = function normalize(vec) {
	const mag = Vec2.magnitude(vec);
	return sP({
		x: vec.x / mag,
		y: vec.y / mag
	}, Vec2.prototype);
};
Vec2.prototype.normalize = function normalize() {
	return Vec2.normalize(this);
};
Vec2.distance = function distance(vec1, vec2) {
	return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2);
};
Vec2.prototype.distance = function distance(vec) {
	return Vec2.distance(this, vec);
};
Vec2.angle = function angle(vec1, vec2) {
	const dotProduct = Vec2.dotProduct(vec1, vec2);
	const magnitudes = Vec2.magnitude(vec1) * Vec2.magnitude(vec2);
	return Math.acos(dotProduct / magnitudes);
};
Vec2.prototype.angle = function angle(vec) {
	return Vec2.angle(this, vec);
};
Vec2.lerp = function lerp(vec1, vec2, t) {
	return sP({
		x: vec1.x + (vec2.x - vec1.x) * t,
		y: vec1.y + (vec2.y - vec1.y) * t
	}, Vec2.prototype);
};
Vec2.prototype.lerp = function lerp(vec, t) {
	return Vec2.lerp(this, vec, t);
};
Vec2.rotate = function rotate(vec, angle) {
	const cos$1 = Math.cos(angle);
	const sin$2 = Math.sin(angle);
	return sP({
		x: vec.x * cos$1 - vec.y * sin$2,
		y: vec.x * sin$2 + vec.y * cos$1
	}, Vec2.prototype);
};
Vec2.prototype.rotate = function rotate(angle) {
	return Vec2.rotate(this, angle);
};

//#endregion
//#region app/managers/input.ts
let KeyboardKey = function(KeyboardKey$1) {
	KeyboardKey$1["ArrowDown"] = "ArrowDown";
	KeyboardKey$1["ArrowUp"] = "ArrowUp";
	KeyboardKey$1["ArrowLeft"] = "ArrowLeft";
	KeyboardKey$1["ArrowRight"] = "ArrowRight";
	KeyboardKey$1["Space"] = " ";
	return KeyboardKey$1;
}({});
var InputManager = class {
	wasPressed = new Set();
	pressedKeys = {};
	constructor() {
		window.addEventListener("keydown", (e) => {
			if (e.repeat) return;
			this.pressedKeys[e.key] = true;
			this.wasPressed.add(e.key);
		});
		window.addEventListener("keyup", (e) => {
			delete this.pressedKeys[e.key];
		});
	}
};
const inputManager = new InputManager();

//#endregion
//#region app/element-id.ts
let ElementIds = function(ElementIds$1) {
	ElementIds$1["WindowTitle"] = "element-title-window-title";
	ElementIds$1["ViewportCanvas"] = "element-canvas-viewport";
	return ElementIds$1;
}({});

//#endregion
//#region app/managers/ui.ts
var UIManager = class UIManager {
	static getElement(id) {
		const e = document.getElementById(id);
		if (!e) throw new ReferenceError("Failed to get element with id of " + id);
		return e;
	}
	canvasElement;
	titleElement;
	bodyElement;
	context;
	clientWidth = 0;
	clientHeight = 0;
	constructor() {
		this.canvasElement = UIManager.getElement(ElementIds.ViewportCanvas);
		this.titleElement = UIManager.getElement(ElementIds.WindowTitle);
		this.bodyElement = document.body;
		this.context = this.canvasElement.getContext("2d");
		if (!this.context) throw new ReferenceError("Failed to get context from canvas");
		this.title = "PacMan lite";
		window.addEventListener("resize", () => this.__update());
		this.__update();
	}
	get title() {
		return this.titleElement.textContent;
	}
	set title(v) {
		this.titleElement.textContent = v;
	}
	get canvasWidth() {
		return this.canvasElement.width;
	}
	get canvasHeight() {
		return this.canvasElement.height;
	}
	__update() {
		this.clientWidth = this.bodyElement.clientWidth;
		this.clientHeight = this.bodyElement.clientHeight;
	}
	close() {
		window.close();
	}
	setWindowSize(width, height) {
		window.resizeTo(width, height);
	}
	newCanvas() {
		return document.createElement("canvas");
	}
};
const uiManager = new UIManager();

//#endregion
//#region app/drawable/animation/custom-function.ts
const { sin: sin$1, PI: PI$1 } = Math;
const QU = PI$1 / 2;

//#endregion
//#region app/drawable/drawable.ts
var Drawable = class {
	render(context) {
		context.save();
		this.__render__(context);
		context.restore();
	}
};

//#endregion
//#region app/drawable/visual.ts
var Visual = class extends Drawable {
	animations = new Set();
	async playAnimation(animation, duration) {
		return new Promise((res) => this.animations.add({
			animation,
			endTimeDelta: 1 / (performance.now() + duration),
			res
		}));
	}
	__render__(context) {
		this.draw(context);
	}
	draw(context, time = performance.now()) {
		for (const a of this.animations) {
			const d = time * a.endTimeDelta;
			if (d > 1) {
				this.animations.delete(a);
				a.res();
				continue;
			}
			a.animation.apply(context, d);
		}
		this.__draw__(context);
	}
};

//#endregion
//#region app/drawable/stride.ts
var Stride = class extends Drawable {
	constructor(visual) {
		super();
		this.visual = visual;
	}
	scaleX = 1;
	scaleY = 1;
	rotation = 0;
	position = Vec2(0, 0);
	__render__(context) {
		context.translate(this.position.x, this.position.y);
		context.scale(this.scaleX, this.scaleY);
		if (this.rotation) context.rotate(this.rotation);
		this.visual.draw(context);
	}
};

//#endregion
//#region app/drawable/shapes.ts
const { PI, sin, cos } = Math;
const PIx2 = PI * 2;
var DrawableShapesFunctions = class {
	constructor() {}
	static circlePath(context, radius = 1) {
		context.arc(0, 0, radius, 0, PIx2);
	}
	static anyGonPath(context, gonLevel, size = 1) {
		const rad = PIx2 / gonLevel;
		for (let i = 0; i <= gonLevel; i++) {
			const angle = i * rad;
			const dx = size * cos(angle);
			const dy = size * sin(angle);
			if (i === 0) context.moveTo(dx, dy);
			else context.lineTo(dx, dy);
		}
	}
};
var DrawableShapesPaths = class {
	constructor() {}
	static anyGonPaths = {
		min: 2,
		max: 30
	};
	static triangle = this.anyGonPaths[3] ??= new Path2D();
	static rectangle = this.anyGonPaths[4] ??= new Path2D();
	static pentagon = this.anyGonPaths[5] ??= new Path2D();
	static hexagon = this.anyGonPaths[6] ??= new Path2D();
	static circle = new Path2D();
	static {
		const p = this.anyGonPaths;
		for (let i = p.min; i < p.max; i++) {
			DrawableShapesFunctions.anyGonPath(p[i] ??= new Path2D(), i);
			p[i].closePath();
		}
		this.circle.arc(0, 0, 1, 0, PIx2);
		this.circle.closePath();
	}
};

//#endregion
//#region app/drawable/custom-visual.ts
var CustomVisual = class extends Visual {
	constructor(callable) {
		super();
		this.callable = callable;
	}
	__draw__(context) {
		this.callable(context);
	}
};

//#endregion
//#region app/entities/entity.ts
var Entity = class extends Stride {
	velocity = Vec2(0, 0);
	constructor() {
		super(null);
	}
	__render__(context) {
		const { x, y } = this.velocity, d = context.__delta__;
		context.translate(x * d, y * d);
		super.__render__(context);
	}
};

//#endregion
//#region app/game/enemy.ts
var Enemy = class extends Entity {
	health = 200;
	damage = 200;
	constructor(game$1) {
		super();
		this.game = game$1;
		const g = 0;
		this.visual = new CustomVisual((c) => {
			c.rotate(Math.PI * 2 * Math.random());
			c.stroke(DrawableShapesPaths.anyGonPaths[2 + Math.ceil(g + 3 * Math.random())]);
		});
	}
};

//#endregion
//#region app/game/projectile.ts
var Projectile = class extends Entity {
	constructor() {
		super();
		const g = 0;
		this.visual = new CustomVisual((c) => {
			const { x, y } = this.velocity.normalize();
			c.rotate(Math.atan2(y, x) - Math.PI / 2);
			c.fillRect(-5, -20, 10, 40);
		});
	}
};

//#endregion
//#region app/game/game.ts
var Game = class {
	constructor(context) {
		this.context = context;
	}
	optionsResolution = 1024;
	optionsShowStats = false;
	optionsUseDelta = true;
	optionsTickTime = 200;
	__delta = 1;
	__deltaPrediction = 1;
	tickUpTime = performance.now();
	fpsIncrement = 0;
	fpsCount = 0;
	fpsTimestamp = 0;
	currentTick = 0;
	forceFieldRadius = 500;
	coreRadius = 75;
	coreHealth = 580;
	maxCoreHealth = 580;
	enemyRadius = 40;
	enemies = new Set();
	projectiles = new Set();
	async start() {
		const canvas = uiManager.canvasElement;
		canvas.height = canvas.width = this.optionsResolution;
		this.currentTick = 0;
		this.renderLoop();
		this.tick();
	}
	tickEnemies() {
		let targetEnemy = null;
		let targetEnemyDistance = Infinity;
		let __cacheSaveRadius = this.coreRadius + this.enemyRadius;
		for (const enemy of this.enemies) {
			const newPosition = enemy.position.add(enemy.velocity);
			const distance = enemy.position.magnitude();
			enemy["__distance__"] = distance;
			if (distance <= __cacheSaveRadius) {
				this.coreHealth--;
				this.enemies.delete(enemy);
			}
			if (distance < targetEnemyDistance) {
				targetEnemy = enemy;
				targetEnemyDistance = distance;
			}
			let newVelocity = enemy.velocity.add(enemy.position.normalize().multiplyS(-2.8));
			newVelocity = newVelocity.add(Vec2(newVelocity.y, -newVelocity.x).multiplyS(.08));
			if (newVelocity.magnitude() > 10) newVelocity = newVelocity.normalize().multiplyS(10);
			enemy.velocity = newVelocity;
			enemy.position = newPosition;
		}
	}
	async tick() {
		this.tickEnemies();
		if (this.currentTick % 5 === 0) for (let i = 0; i < 1; i++) {
			const entity = new Enemy(this);
			entity.position = Vec2(Math.random() - .5, Math.random() - .5).normalize().multiplyS(1e3);
			entity.rotation = Math.PI * 2 * Math.random();
			entity.velocity = entity.position.multiplyS(-.01);
			entity.scaleX = entity.scaleY = this.enemyRadius;
			this.enemies.add(entity);
		}
		if (this.currentTick % 5 === 0) {
			const projectile = new Projectile();
			this.enemies.add(projectile);
			projectile.position = Vec2(Math.random() - .5, Math.random() - .5).normalize().multiplyS(1e3);
			const { x, y } = projectile.velocity = projectile.position.multiplyS(-.03);
			projectile.velocity = projectile.velocity.add(Vec2(y, -x));
		}
		this.currentTick++;
	}
	getStats() {
		return `FPS: ${this.fpsCount}, RES: ${this.optionsResolution}x${this.optionsResolution}, D: ${this.__delta.toFixed(2)}, TICK: ${this.currentTick}, ENTITIES: ${this.enemies.size}`;
	}
	async renderLoop() {
		let now = performance.now(), difference = now - this.tickUpTime;
		if (difference > this.optionsTickTime) {
			this.tickUpTime = now;
			difference = 0;
			this.tick();
		}
		if (now - this.fpsTimestamp > 1e3) {
			this.fpsCount = this.fpsIncrement;
			this.fpsIncrement = 0;
			this.fpsTimestamp = now;
		}
		const context = this.context;
		context.__delta__ = this.__delta = difference / this.optionsTickTime;
		const scale = new Vec2(uiManager.clientHeight, uiManager.clientWidth).normalize();
		context.reset();
		context.textRendering = "optimizeSpeed";
		if (this.optionsShowStats) {
			context.save();
			context.fillStyle = "#9999";
			context.textAlign = "start";
			context.textBaseline = "top";
			context.scale(scale.x * 3.2, scale.y * 3);
			context.fillText(this.getStats(), 4, 4);
			context.restore();
		}
		context.translate(context.canvas.width / 2, context.canvas.height / 2);
		context.scale(scale.x, scale.y);
		this.renderForceField();
		context.strokeStyle = "#6699ff";
		context.fillStyle = "#b38";
		context.lineWidth = .1;
		for (const enemy of this.enemies) enemy.render(context);
		this.renderCore();
		this.fpsIncrement++;
		requestAnimationFrame(() => this.renderLoop());
	}
	renderForceField() {
		const { context, forceFieldRadius } = this;
		context.save();
		context.scale(forceFieldRadius, forceFieldRadius);
		context.strokeStyle = "#8899ff99";
		context.lineWidth = 3 / forceFieldRadius;
		context.fillStyle = "#8899ff08";
		context.stroke(DrawableShapesPaths.circle);
		context.fill(DrawableShapesPaths.circle);
		context.strokeStyle = "#fff8";
		context.lineWidth = 1 / forceFieldRadius;
		context.stroke(DrawableShapesPaths.circle);
		context.restore();
	}
	renderCore() {
		const stability = this.coreHealth / this.maxCoreHealth, context = this.context, shapeStability = 4 + 10 * stability;
		const reverseStability = 1 - stability;
		context.save();
		context.fillStyle = "white";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.scale(2, 2);
		context.fillText((stability * 100).toFixed(1) + "%", 0, 0);
		context.restore();
		context.save();
		context.scale(this.coreRadius, this.coreRadius);
		for (let i = 0; i < 1 + reverseStability * 5; i++) {
			context.save();
			context.rotate(Math.random() * Math.PI * 2);
			const scale = Math.random() * reverseStability * .5;
			context.scale(1 + scale, 1 + scale);
			const shape = DrawableShapesPaths.anyGonPaths[~~(shapeStability + Math.random() * 2)];
			context.strokeStyle = `#fff`;
			context.lineWidth = 1 / this.coreRadius;
			context.stroke(shape);
			context.strokeStyle = `rgb(${50 + reverseStability * 155}, 50, ${100 + stability * 155})`;
			context.lineWidth = 3 / this.coreRadius;
			context.fillStyle = "#2042";
			context.stroke(shape);
			context.fill(shape);
			context.restore();
		}
		context.restore();
	}
};

//#endregion
//#region app/main.ts
const game = new Game(uiManager.context);
game.optionsShowStats = true;
game.optionsResolution = 1024;
game.start();

//#endregion