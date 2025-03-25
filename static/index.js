
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
Vec2.reflect = function reflect(vec, normal$1) {
	const dotProduct = Vec2.dotProduct(vec, normal$1);
	return sP({
		x: vec.x - 2 * dotProduct * normal$1.x,
		y: vec.y - 2 * dotProduct * normal$1.y
	}, Vec2.prototype);
};
Vec2.prototype.reflect = function reflect(normal$1) {
	return Vec2.reflect(this, normal$1);
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
//#region app/drawable/animation/visual-property.ts
var AnimationVisualProperty = class {};

//#endregion
//#region app/drawable/animation/rotation-visual-property.ts
var AnimationRotationVisualProperty = class extends AnimationVisualProperty {
	constructor(rad) {
		super();
		this.rad = rad;
	}
	apply(context, delta) {
		context.rotate(this.rad * delta);
	}
};

//#endregion
//#region app/drawable/animation/scale-visual-property.ts
var AnimationScaleVisualProperty = class extends AnimationVisualProperty {
	constructor(scale) {
		super();
		this.scale = scale;
	}
	apply(context, delta) {
		const { x, y } = this.scale;
		context.scale(1 + x * delta - delta, 1 + y * delta - delta);
	}
};

//#endregion
//#region app/drawable/animation/translate-visual-property.ts
var AnimationTranslateVisualProperty = class extends AnimationVisualProperty {
	constructor(offset) {
		super();
		this.offset = offset;
	}
	apply(context, delta) {
		const { x, y } = this.offset;
		context.translate(x * delta, y * delta);
	}
};

//#endregion
//#region app/drawable/animation/animation.ts
var Animation = class {
	properties;
	constructor(func, ...properties) {
		this.func = func;
		this.properties = properties;
	}
	apply(context, baseDelta) {
		const d = this.func.pass(baseDelta);
		for (let i = 0; i < this.properties.length; i++) this.properties[i].apply(context, d);
	}
};

//#endregion
//#region app/drawable/animation/state.ts
var AnimationFunction = class {};

//#endregion
//#region app/drawable/animation/custom-function.ts
const { sin: sin$1, PI: PI$1 } = Math;
const QU = PI$1 / 2;
var AnimationCustomFunctionChain = class extends AnimationFunction {
	constructor(nodes) {
		super();
		this.nodes = nodes;
	}
	reset = undefined;
	pass(d) {
		for (let i = 0; i < this.nodes.length; i++) d = this.nodes[i](d);
		return d;
	}
	chain(node) {
		this.nodes.push(node);
		return this;
	}
};
var AnimationNodeTypes = class {
	constructor() {}
	static sineNode = (t) => sin$1(QU * t);
	static quadraticNode = (t) => t ** 2;
	static inverseNode = (t) => 1 - t;
	static create(...nodes) {
		return new AnimationCustomFunctionChain(nodes);
	}
};

//#endregion
//#region app/drawable/animation/index.ts
var AnimationTypes = class {
	constructor() {}
	static rotation(rad) {
		return new AnimationRotationVisualProperty(rad);
	}
	static translation(offset) {
		return new AnimationTranslateVisualProperty(offset);
	}
	static scale(scale) {
		return new AnimationScaleVisualProperty(scale);
	}
};

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
	health = 50;
	damage = 10;
	abstractHealth = 0;
	maxSpeedAmplifier = 1;
	constructor(game$1) {
		super();
		this.game = game$1;
		const g = 0;
		this.visual = new CustomVisual((c) => {
			c.rotate(Math.PI * 2 * Math.random());
			c.stroke(DrawableShapesPaths.anyGonPaths[2 + Math.ceil(g + 3 * Math.random())]);
		});
		this.abstractHealth = this.health;
	}
};

//#endregion
//#region app/game/projectile.ts
var Projectile = class extends Entity {
	target = null;
	damage = 10;
	constructor() {
		super();
		this.visual = new CustomVisual((c) => {
			const { x, y } = this.velocity.normalize();
			c.rotate(Math.atan2(y, x) - Math.PI / 2);
			c.fillRect(-5, -20, 10, 40);
		});
	}
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
	ElementIds$1["TableTitles"] = "table-headers";
	ElementIds$1["TableValues"] = "table-values";
	ElementIds$1["TableButtons"] = "table-buttons";
	ElementIds$1["Stats"] = "stats-div";
	ElementIds$1["GameTitle"] = "GameTitle";
	return ElementIds$1;
}({});

//#endregion
//#region app/managers/ui/manager.ts
var UIManager = class UIManager {
	static getElement(id) {
		const e = document.getElementById(id);
		if (!e) throw new ReferenceError("Failed to get element with id of " + id);
		return e;
	}
	static canvasElement = UIManager.getElement(ElementIds.ViewportCanvas);
	static titleElement = UIManager.getElement(ElementIds.WindowTitle);
	static bodyElement = document.body;
	static context = UIManager.canvasElement.getContext("2d");
	static tableTitles = UIManager.getElement(ElementIds.TableTitles);
	static tableValues = UIManager.getElement(ElementIds.TableValues);
	static tableButtons = UIManager.getElement(ElementIds.TableButtons);
	static gameTitle = UIManager.getElement(ElementIds.GameTitle);
	static statsDiv = UIManager.getElement(ElementIds.Stats);
	static clientWidth = 0;
	static clientHeight = 0;
	static {
		if (!UIManager.context) throw new ReferenceError("Failed to get context from canvas");
		UIManager.titleElement.textContent = "Core Defense";
		window.addEventListener("resize", () => UIManager.__update());
		UIManager.__update();
	}
	static get title() {
		return UIManager.titleElement.textContent;
	}
	static set title(v) {
		UIManager.titleElement.textContent = v;
	}
	static get canvasWidth() {
		return UIManager.canvasElement.width;
	}
	static get canvasHeight() {
		return UIManager.canvasElement.height;
	}
	static __update() {
		UIManager.clientWidth = UIManager.bodyElement.clientWidth;
		UIManager.clientHeight = UIManager.bodyElement.clientHeight;
	}
	static close() {
		window.close();
	}
	static setWindowSize(width, height) {
		window.resizeTo(width, height);
	}
	static newCanvas() {
		return document.createElement("canvas");
	}
	static create = document.createElement.bind(document);
};

//#endregion
//#region app/managers/ui/upgrade-pane.ts
var UpgradePane = class UpgradePane {
	titleElement;
	valueElement;
	buttonElement;
	constructor() {
		this.titleElement = UIManager.create("th");
		this.valueElement = UIManager.create("td");
		const td = UIManager.create("td");
		const div = UIManager.create("div");
		td.appendChild(div);
		this.buttonElement = UIManager.create("button");
		this.buttonElement.className = "background";
		div.appendChild(this.buttonElement);
	}
	static create() {
		const upgradePane = new UpgradePane();
		UIManager.tableTitles.appendChild(upgradePane.titleElement);
		UIManager.tableValues.appendChild(upgradePane.valueElement);
		UIManager.tableButtons.appendChild(upgradePane.buttonElement.parentElement.parentElement);
		return upgradePane;
	}
	get title() {
		return this.titleElement.textContent;
	}
	set title(value) {
		this.titleElement.textContent = value;
	}
	get value() {
		return this.valueElement.textContent;
	}
	set value(value) {
		this.valueElement.textContent = value;
	}
	get buttonText() {
		return this.buttonElement.textContent;
	}
	set buttonText(value) {
		this.buttonElement.textContent = value;
	}
	get onClick() {
		return this.buttonElement.onclick;
	}
	set onClick(action) {
		this.buttonElement.onclick = action;
	}
};

//#endregion
//#region app/managers/ui/info-line.ts
var InfoLine = class InfoLine {
	paragraphElement;
	constructor() {
		this.paragraphElement = UIManager.create("p");
	}
	static create() {
		const infoLine = new InfoLine();
		UIManager.statsDiv.appendChild(infoLine.paragraphElement);
		return infoLine;
	}
	get text() {
		return this.paragraphElement.textContent;
	}
	set text(value) {
		this.paragraphElement.textContent = value;
	}
};

//#endregion
//#region app/game/properties.ts
var GameProperties = class {
	_level;
	_electrons;
	levelInfoLine;
	electronsInfoLine;
	attackSpeed;
	attackRange;
	maxHealth;
	bulletStack;
	damage;
	constructor() {
		this._level = this.getFromLocalStorage("level", 1);
		this._electrons = this.getFromLocalStorage("electrons", 0);
		this.levelInfoLine = InfoLine.create();
		this.electronsInfoLine = InfoLine.create();
		this.updateUI();
		const all = [
			this.attackSpeed = new CoreAbility("attackSpeed", "Attack Speed", .06, 100, 85, .02, 1.2, this.saveAbilityLevel.bind(this)),
			this.attackRange = new CoreAbility("attackRange", "Attack Range", 350, 100, 10, 50, 1.2, this.saveAbilityLevel.bind(this)),
			this.maxHealth = new CoreAbility("maxHealth", "Max Health", 100, 100, 10, 50, 1.2, this.saveAbilityLevel.bind(this)),
			this.bulletStack = new CoreAbility("bulletStack", "Bullet Stack", 2, 200, 8, 1, 1.2, this.saveAbilityLevel.bind(this)),
			this.damage = new CoreAbility("damage", "Damage", 10, 100, 100, 1, 1.2, this.saveAbilityLevel.bind(this))
		];
		for (const a of all) {
			const v = localStorage.getItem(`${a.nameId}Level`) ?? null;
			if (v !== null) a.level = parseInt(v);
		}
	}
	get level() {
		return this._level;
	}
	set level(value) {
		this._level = value;
		this.saveToLocalStorage("level", value);
		this.updateUI();
	}
	get electrons() {
		return this._electrons;
	}
	set electrons(value) {
		this._electrons = value;
		this.saveToLocalStorage("electrons", value);
		this.updateUI();
	}
	get attackSpeedValue() {
		return this.attackSpeed.currentValue;
	}
	get attackRangeValue() {
		return this.attackRange.currentValue;
	}
	get maxHealthValue() {
		return this.maxHealth.currentValue;
	}
	get bulletStackValue() {
		return this.bulletStack.currentValue;
	}
	get damageValue() {
		return this.damage.currentValue;
	}
	saveAbilityLevel(c) {
		if (c.level >= c.maxLevel) return;
		if (c.currentCost > this.electrons) return;
		this.electrons -= c.currentCost;
		c.level++;
		this.saveToLocalStorage(`${c.nameId}Level`, c.level);
	}
	getFromLocalStorage(key, defaultValue) {
		const value = localStorage.getItem(key);
		return value !== null ? parseInt(value, 10) : defaultValue;
	}
	saveToLocalStorage(key, value) {
		localStorage.setItem(key, value.toString());
	}
	updateUI() {
		this.levelInfoLine.text = `Level: ${this._level}`;
		this.electronsInfoLine.text = `Electrons: ${this._electrons.toFixed(0)}$`;
	}
};
var CoreAbility = class {
	nameId;
	displayName;
	initialValue;
	initialCost;
	maxLevel;
	unitPerLevel;
	costAmplifierPerLevel;
	_level;
	upgradePane;
	constructor(nameId, displayName, initialValue, initialCost, maxLevel, unitPerLevel, costAmplifierPerLevel, callback) {
		this.nameId = nameId;
		this.displayName = displayName;
		this.initialValue = initialValue;
		this.initialCost = initialCost;
		this.maxLevel = maxLevel;
		this.unitPerLevel = unitPerLevel;
		this.costAmplifierPerLevel = costAmplifierPerLevel;
		this._level = 0;
		this.upgradePane = UpgradePane.create();
		this.upgradePane.onClick = () => void callback(this);
		this.updateUpgradePane();
	}
	get level() {
		return this._level;
	}
	set level(value) {
		this._level = value;
		this.updateUpgradePane();
	}
	get currentValue() {
		return this.initialValue + this.unitPerLevel * this._level;
	}
	get currentCost() {
		return this.initialCost * Math.pow(this.costAmplifierPerLevel, this._level);
	}
	updateUpgradePane() {
		this.upgradePane.title = this.displayName;
		this.upgradePane.value = `Value: ${this.currentValue.toFixed(2)}`;
		this.upgradePane.buttonText = `Upgrade ${this.currentCost.toFixed()}$`;
		if (this.level >= this.maxLevel) this.upgradePane.buttonElement.style.display = "none";
	}
};

//#endregion
//#region app/utils.ts
var Utils = class {
	constructor() {}
	static isDebug = true;
	static readImageData(img) {
		const cv = document.createElement("canvas");
		const ct = cv.getContext("2d");
		cv.width = img.width;
		cv.height = img.height;
		ct.imageSmoothingEnabled = false;
		ct.drawImage(img, 0, 0);
		return ct.getImageData(0, 0, cv.width, cv.height);
	}
	static async fetchImage(src) {
		const img = new Image();
		img.src = src;
		await new Promise((r) => img.addEventListener("load", r, { once: true }));
		return img;
	}
	static delay(time) {
		return new Promise((res) => setTimeout(res, time));
	}
	static recompute(canvas, mapper) {
		const src = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
		mapper(src.data.buffer, src.width, src.height);
		canvas.getContext("2d").putImageData(src, 0, 0);
	}
};

//#endregion
//#region app/game/level.ts
var BaseInfo = class BaseInfo {
	constructor(level) {
		this.level = level;
	}
	static normal = new BaseInfo(1);
	static strong = new BaseInfo(2);
	static fast = new BaseInfo(.5);
	*times(n) {
		for (let i = 0; i < n; i++) yield this;
	}
};
const { normal, fast, strong } = BaseInfo;
const LEVELS = [
	function* Level1() {
		yield normal;
		yield 80;
		yield normal;
		yield 80;
		yield normal;
		yield 80;
		yield* normal.times(2);
		yield -1;
	},
	function* Level2() {
		yield normal;
		yield 70;
		yield normal;
		yield 70;
		yield normal;
		yield 100;
		yield strong;
		yield 100;
		yield* normal.times(2);
		yield -1;
	},
	function* Level3() {
		yield fast;
		yield 50;
		yield strong;
		yield fast;
		yield 50;
		yield strong;
		yield strong;
		yield 60;
		yield* normal.times(3);
		yield -1;
	},
	function* Level3() {
		yield fast;
		yield 5;
		yield fast;
		yield 20;
		yield strong;
		yield 10;
		yield fast;
		yield 50;
		yield strong;
		yield strong;
		yield strong;
		yield 60;
		yield* normal.times(4);
		yield -1;
	},
	function* Level4() {
		for (let i = 0; i < 10; i++) {
			yield fast;
			yield 5;
		}
		yield fast;
		yield strong;
		yield 20;
		yield strong;
		yield 10;
		yield fast;
		yield strong;
		yield 50;
		yield strong;
		yield strong;
		yield strong;
		yield 60;
		yield* normal.times(5);
		yield -1;
	},
	function* Level5() {
		for (let i = 0; i < 10; i++) {
			yield fast;
			yield normal;
			yield 10;
		}
		yield strong;
		yield fast;
		yield strong;
		yield 20;
		yield strong;
		yield 10;
		yield fast;
		yield strong;
		yield strong;
		yield 50;
		yield strong;
		yield strong;
		yield strong;
		yield 120;
		yield* normal.times(15);
		yield -1;
	}
];
function* INFINITY_LEVEL() {
	for (let i = 0; i < 100; i += .1) {
		yield* normal.times(i);
		yield 20;
	}
	yield -1;
}

//#endregion
//#region app/game/game.ts
var Game = class {
	gameProperties = new GameProperties();
	keepRendering = false;
	constructor(context) {
		this.context = context;
	}
	optionsResolution = 1024;
	optionsShowStats = false;
	optionsUseDelta = true;
	optionsTickTime = 60;
	__delta = 1;
	__deltaPrediction = 1;
	tickUpTime = performance.now();
	fpsIncrement = 0;
	fpsCount = 0;
	fpsTimestamp = 0;
	currentTick = 0;
	levelInProgress = null;
	baseScale = .8;
	forceFieldRadius = 500;
	coreRadius = 75;
	coreHealth = 80;
	maxCoreHealth = 580;
	maxReward = 150;
	minReward = 50;
	enemyHitBox = 40;
	projectilesToSpawn = 0;
	maxEnemySpeed = 2;
	enemyHealth = 50;
	enemyDamage = 10;
	maxProjectileSpeed = 35;
	projectileHitBox = 40;
	enemies = new Set();
	activeEnemies = new Set();
	projectiles = new Set();
	async showTitle(title, timeout) {
		UIManager.gameTitle.textContent = title;
		UIManager.gameTitle.style.display = "block";
		await Utils.delay(timeout);
		UIManager.gameTitle.style.display = "none";
	}
	*levelRunner(level) {
		for (const info of level) {
			if (typeof info === "number") {
				if (info < 0) while (this.enemies.size) yield;
				for (let i = 0; i < info; i++) yield;
			} else this.spawnEnemy(info);
		}
	}
	async onEnd() {
		await Utils.delay(500);
		this.context.reset();
		if (this.coreHealth <= 0) await this.showTitle("You failed to pass this level!", 2e3);
		else {
			this.gameProperties.level++;
			await this.showTitle("Level Passed!", 2e3);
			this.gameProperties.electrons += this.gameProperties.level * 2 * 100;
		}
		this.start();
	}
	async start() {
		if (this.gameProperties.level > LEVELS.length) {
			this.gameProperties.level = LEVELS.length + 1;
		}
		await this.showTitle("Level " + (this.gameProperties.level > LEVELS.length ? "Impossible" : this.gameProperties.level), 3e3);
		this.levelInProgress = this.levelRunner(LEVELS[this.gameProperties.level - 1]?.() ?? INFINITY_LEVEL());
		const canvas = UIManager.canvasElement;
		canvas.height = canvas.width = this.optionsResolution;
		this.forceFieldRadius = this.gameProperties.attackRangeValue + this.coreRadius;
		this.coreHealth = this.maxCoreHealth = this.gameProperties.maxHealthValue;
		this.baseScale = 400 / this.forceFieldRadius;
		this.currentTick = 0;
		this.keepRendering = true;
		this.renderLoop();
		this.tick();
	}
	enemyKill(enemy) {
		this.enemies.delete(enemy);
		this.activeEnemies.delete(enemy);
	}
	allEnemyTick() {
		const __cR__ = this.coreRadius + this.enemyHitBox;
		let targetEnemy = null, _targetEnemyDistance = Infinity;
		for (const enemy of this.enemies) {
			const _pos = enemy.position = enemy.position.add(enemy.velocity);
			let maxEnemySpeed = this.maxEnemySpeed * enemy.maxSpeedAmplifier;
			const distance = _pos.magnitude();
			if (distance <= __cR__) {
				this.coreHealth -= enemy.damage;
				this.enemyKill(enemy);
			}
			if (distance <= this.forceFieldRadius) {
				maxEnemySpeed *= .8;
				if (enemy.abstractHealth > 0) {
					this.activeEnemies.add(enemy);
					if (distance < _targetEnemyDistance) {
						targetEnemy = enemy;
						_targetEnemyDistance = distance;
					}
				}
			}
			let newVelocity = enemy.velocity.add(_pos.normalize().multiplyS(-maxEnemySpeed));
			if (newVelocity.magnitude() > maxEnemySpeed) {
				newVelocity = newVelocity.normalize().multiplyS(maxEnemySpeed);
			}
			enemy.velocity = newVelocity;
		}
		return targetEnemy;
	}
	allProjectileTick() {
		const _minDistance = this.projectileHitBox + this.enemyHitBox;
		for (const projectile of this.projectiles) {
			const _pos = projectile.position = projectile.position.add(projectile.velocity);
			const target = projectile.target;
			if (!target || !this.enemies.has(target)) {
				this.projectiles.delete(projectile);
				continue;
			}
			const relativeVec = projectile.position.subtract(target.position);
			const distance = relativeVec.magnitude();
			if (distance <= _minDistance) {
				this.projectiles.delete(projectile);
				if ((target.health -= projectile.damage) <= 0) {
					this.gameProperties.electrons += ~~((this.maxReward - this.minReward) * Math.random() + this.minReward);
					this.enemyKill(target);
				}
				target.velocity = target.velocity.add(projectile.velocity.multiplyS(.3));
				continue;
			}
			let newVelocity = projectile.velocity.add(relativeVec.normalize().multiplyS(-this.maxProjectileSpeed));
			if (newVelocity.magnitude() > this.maxProjectileSpeed) {
				newVelocity = newVelocity.normalize().multiplyS(this.maxProjectileSpeed);
			}
			projectile.velocity = newVelocity;
		}
	}
	spawnProjectile(target) {
		const projectile = new Projectile();
		projectile.damage = this.gameProperties.damageValue;
		projectile.target = target;
		this.projectiles.add(projectile);
		this.projectilesToSpawn--;
		if ((target.abstractHealth -= projectile.damage) <= 0) this.activeEnemies.delete(target);
		return projectile;
	}
	spawnEnemy(baseInfo) {
		const entity = new Enemy(this);
		entity.position = Vec2(Math.random() - .5, Math.random() - .5).normalize().multiplyS(this.forceFieldRadius + this.enemyHitBox * 5);
		entity.rotation = Math.PI * 2 * Math.random();
		entity.velocity = entity.position.multiplyS(-.01);
		entity.scaleX = entity.scaleY = this.enemyHitBox * baseInfo.level;
		entity.damage = this.enemyDamage * baseInfo.level;
		entity.health = entity.abstractHealth = this.enemyHealth * baseInfo.level;
		entity.maxSpeedAmplifier = this.maxEnemySpeed / baseInfo.level;
		console.log(baseInfo.level);
		this.enemies.add(entity);
	}
	async tick() {
		const newTarget = this.allEnemyTick();
		this.allProjectileTick();
		const { done } = this.levelInProgress?.next() ?? {};
		if (newTarget && this.projectilesToSpawn >= 1) this.spawnProjectile(newTarget);
		if (this.projectilesToSpawn < this.gameProperties.bulletStackValue) {
			this.projectilesToSpawn += this.gameProperties.attackSpeedValue;
		}
		this.forceFieldRadius = this.gameProperties.attackRangeValue + this.coreRadius;
		this.baseScale = 400 / this.forceFieldRadius;
		this.currentTick++;
		if (this.coreHealth <= 0 || done) {
			this.keepRendering = false;
			this.onEnd();
		}
	}
	getStats() {
		return `FPS: ${this.fpsCount}, RES: ${this.optionsResolution}x${this.optionsResolution}, D: ${this.__delta.toFixed(2)}, TICK: ${this.currentTick}, EE: ${this.enemies.size}, EPR: ${this.projectiles.size}, STACK: ${this.projectilesToSpawn.toFixed(2)}`;
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
		const scale = new Vec2(UIManager.clientHeight, UIManager.clientWidth).normalize();
		context.reset();
		context.textRendering = "optimizeSpeed";
		if (this.optionsShowStats) {
			context.save();
			context.fillStyle = "#9994";
			context.textAlign = "start";
			context.textBaseline = "top";
			context.scale(scale.x * 3.2, scale.y * 3);
			context.fillText(this.getStats(), 4, 4);
			context.restore();
		}
		context.translate(context.canvas.width / 2, context.canvas.height / 2);
		context.scale(scale.x, scale.y);
		context.scale(this.baseScale, this.baseScale);
		this.renderForceField();
		context.strokeStyle = "#6699ff";
		context.fillStyle = "#baf";
		context.lineWidth = .1;
		for (const enemy of this.enemies) enemy.render(context);
		for (const projectile of this.projectiles) projectile.render(context);
		this.renderCore();
		this.fpsIncrement++;
		if (this.keepRendering) requestAnimationFrame(() => this.renderLoop());
		else if (this.coreHealth <= 0) {
			context.reset();
			context.textRendering = "optimizeSpeed";
			context.translate(context.canvas.width / 2, context.canvas.height / 2);
			context.scale(scale.x, scale.y);
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.strokeStyle = "#ff3344";
			context.fillStyle = "#0004";
			context.scale(15 / this.baseScale, 15 / this.baseScale);
			context.fillRect(-40, -6, 80, 14);
			context.strokeText("GAME OVER", 0, 0);
			context.scale(.3, .3);
			context.strokeText("Reactor Exploded", 0, 18);
		}
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
const game = new Game(UIManager.context);
game.optionsShowStats = true;
game.optionsResolution = 1024;
game.start();

//#endregion