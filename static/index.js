
//#region src/client/math/vec2.ts
const sP = Object.setPrototypeOf;
const Vec2 = function Vec2$1(x, y) {
	return sP({
		x,
		y
	}, new.target?.prototype ?? Vec2$1.prototype);
};
Vec2.add = function add(vec1, vec2OrScalar) {
	if (typeof vec2OrScalar === "number") return sP({
		x: vec1.x + vec2OrScalar,
		y: vec1.y + vec2OrScalar
	}, Vec2.prototype);
	return sP({
		x: vec1.x + vec2OrScalar.x,
		y: vec1.y + vec2OrScalar.y
	}, Vec2.prototype);
};
Vec2.prototype.add = function add(vecOrScalar) {
	return Vec2.add(this, vecOrScalar);
};
Vec2.subtract = function subtract(vec1, vec2OrScalar) {
	if (typeof vec2OrScalar === "number") return sP({
		x: vec1.x - vec2OrScalar,
		y: vec1.y - vec2OrScalar
	}, Vec2.prototype);
	return sP({
		x: vec1.x - vec2OrScalar.x,
		y: vec1.y - vec2OrScalar.y
	}, Vec2.prototype);
};
Vec2.prototype.subtract = function subtract(vecOrScalar) {
	return Vec2.subtract(this, vecOrScalar);
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
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return sP({
		x: vec.x * cos - vec.y * sin,
		y: vec.x * sin + vec.y * cos
	}, Vec2.prototype);
};
Vec2.prototype.rotate = function rotate(angle) {
	return Vec2.rotate(this, angle);
};

//#endregion
//#region src/client/texture/drawable.ts
var Drawable = class {
	render(context) {
		context.save();
		this.__render__(context);
		context.restore();
	}
};

//#endregion
//#region src/client/texture/texture-source.ts
var TextureSource = class extends Drawable {
	scaleX = 1;
	scaleY = 1;
	rotation = 0;
	__render__(context) {
		const data = this.getTextureData();
		context.scale(this.scaleX, this.scaleY);
		if (this.rotation) context.rotate(this.rotation);
		context.drawImage(data.src, data.x, data.y, data.w, data.h, -(data.w / 2), -(data.h / 2), data.w, data.h);
	}
};

//#endregion
//#region src/client/texture/texture.ts
var Texture = class extends TextureSource {
	constructor(src, x, y, w, h) {
		super();
		this.src = src;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	getTextureData() {
		return this;
	}
};

//#endregion
//#region src/client/texture/texture-frame.ts
var FrameTexture = class extends TextureSource {
	frames = [];
	currentFrame = 0;
	addFrame(src, x, y, w, h) {
		this.frames.push({
			src,
			x,
			y,
			w,
			h
		});
	}
	addFrameData(data) {
		this.frames.push(data);
	}
	getTextureData(frame) {
		return this.frames[(frame ?? this.currentFrame) % this.frames.length];
	}
};

//#endregion
//#region src/client/utils.ts
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
//#region src/client/texture/texture-map.ts
var TextureMap = class TextureMap extends Texture {
	constructor(src) {
		super(src, 0, 0, src.width, src.height);
		this.src = src;
	}
	getTexture(x, y, w, h) {
		return new Texture(this.src, this.x + x, this.y + y, w, h);
	}
	getFrameTexture(x, y, w, h, frames) {
		const frameTexture = new FrameTexture();
		for (let i = 0; i < frames; i++) frameTexture.addFrame(this.src, this.x + x + i * w, y, w, h);
		return frameTexture;
	}
	static async FromSrc(str) {
		const img = await Utils.fetchImage(str);
		return new TextureMap(img);
	}
};

//#endregion
//#region src/client/texture/texture-reader.ts
var TextureReader = class TextureReader {
	buffer;
	constructor(buffer, width, height) {
		this.width = width;
		this.height = height;
		this.buffer = new Uint32Array(buffer);
	}
	getPixelColor(x, y) {
		if (x < 0 || x >= this.width) return -1;
		if (y < 0 || y >= this.height) return -1;
		return this.buffer[y * this.width + x];
	}
	static From(src) {
		return new this(src.data.buffer, src.width, src.height);
	}
	static async FromSrc(str) {
		const img = await Utils.fetchImage(str);
		const { data, height, width } = Utils.readImageData(img);
		return new TextureReader(data.buffer, width, height);
	}
};

//#endregion
//#region src/client/managers/input.ts
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
const input = new InputManager();

//#endregion
//#region src/client/element-id.ts
let ElementIds = function(ElementIds$1) {
	ElementIds$1["WindowTitle"] = "element-title-window-title";
	ElementIds$1["ViewportCanvas"] = "element-canvas-viewport";
	return ElementIds$1;
}({});

//#endregion
//#region src/client/managers/ui.ts
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
const ui = new UIManager();

//#endregion
//#region src/client/managers/network.ts
var NetworkManager = class {
	async ping() {
		return !await this.fetchJSON("/api/ping");
	}
	async getLevels() {
		return await this.fetchJSON("/api/levels").then((e) => e?.data ?? null);
	}
	async fetchJSON(url) {
		const response = await fetch(url).catch(() => null);
		if (!response || !response.ok) return null;
		return await response.json().catch((e) => null);
	}
};
const network = new NetworkManager();

//#endregion
//#region src/client/pacman/level/level-mapper.ts
var LevelMapper = class {
	constructor() {}
	static createTextureMap(textureMap, offsetX, size) {
		const _textureData = (x, y) => textureMap.getTexture(x * size, y * size, size, size);
		const map = {};
		for (let i = 0; i < 256; i++) {
			const [x, y] = this.getTextureOffset(i);
			map[i] = _textureData(x + offsetX, Number(y));
		}
		return map;
	}
	static getTextureOffset(bitMap) {
		let bitsCount = this.getPositiveBitCount(bitMap & 85);
		const masks = [...this.getMaskRotations(bitMap, 3)];
		let offset = 0;
		if (bitsCount === 0) return [offset, 0];
		offset++;
		if (bitsCount === 1) {
			for (let i in masks) if ((masks[i] & 1) > 0) return [offset, i];
		}
		offset++;
		if (bitsCount === 2) for (let i in masks) {
			if (this.m(masks[i], 5)) return [offset + (this.m(masks[i], 7) ? 2 : 1), i];
			if (this.m(masks[i], 17)) return [offset, i];
		}
		offset += 3;
		if (bitsCount === 3) for (let i in masks) {
			let b = masks[i];
			if (this.m(b, 21)) if (this.m(b, 23)) if (this.m(b, 31)) return [offset + 3, i];
			else return [offset + 1, i];
			else if (this.m(b, 29)) return [offset + 2, i];
			else return [offset, i];
		}
		offset += 4;
		if (bitsCount === 4) {
			bitsCount = this.getPositiveBitCount(bitMap & 170);
			if (bitsCount === 0) return [offset, 0];
			offset++;
			if (bitsCount === 1) {
				for (let i in masks) if (this.m(masks[i], 87)) return [offset, i];
			}
			offset++;
			if (bitsCount === 2) for (let i in masks) {
				if (this.m(masks[i], 95)) return [offset, i];
				if (this.m(masks[i], 119)) return [offset + 1, i];
			}
			offset += 2;
			if (bitsCount === 3) {
				for (let i in masks) if (this.m(masks[i], 127)) return [offset, i];
			}
			offset++;
			if (bitsCount === 4) return [offset, 0];
		}
		return [0, 0];
	}
	static m(b1, b2) {
		return (b1 & b2) === b2;
	}
	static maskRotation(b1, offset) {
		const p = (b1 & 255) >> offset;
		const p2 = (b1 & 255) << 8 - offset & 255;
		return p | p2;
	}
	static *getMaskRotations(n1, rotations) {
		yield n1;
		for (let i = 0; i < rotations; i++) yield n1 = this.maskRotation(n1, 2);
	}
	static getPositiveBitCount(n) {
		let i = 0;
		do
			i += n & 1;
		while ((n >>= 1) > 0);
		return i;
	}
};

//#endregion
//#region src/client/pacman/resources.ts
var Resources = class Resources {
	constructor(textureMap, collisionTextureSet) {
		this.textureMap = textureMap;
		this.collisionTextureSet = collisionTextureSet;
	}
	static async From(src) {
		const img = await Utils.fetchImage(src);
		const map = new TextureMap(img);
		const set = LevelMapper.createTextureMap(map, 17, 8);
		return new Resources(map, set);
	}
};

//#endregion
//#region src/client/pacman/level/level-texture-generator.ts
var LevelTextureGenerator = class extends TextureSource {
	src = ui.newCanvas();
	x = 0;
	y = 0;
	get h() {
		return this.src.height;
	}
	get w() {
		return this.src.width;
	}
	getTextureData() {
		return this;
	}
	constructor(scale) {
		super();
		this.scale = scale;
	}
	static generate(provider, resources$1, scale = 8) {
		const gen = new this(scale);
		const canvas = gen.src, context = canvas.getContext("2d"), textureSet = resources$1.collisionTextureSet;
		canvas.style.backgroundColor = "transparent";
		context.fillStyle = "transparent";
		context.reset();
		const { w: sw, h: sh } = provider;
		canvas.width = sw * scale;
		canvas.height = sh * scale;
		context.imageSmoothingEnabled = false;
		for (let x = 0; x < sw; x++) for (let y = 0; y < sh; y++) if (provider.getAvailability(x, y)) {
			Resources.prototype.textureMap;
			const data = (textureSet[provider.getBitMaskFor(x, y)] ?? textureSet[0]).getTextureData();
			ui.context.imageSmoothingEnabled = false;
			context.drawImage(data.src, data.x, data.y, data.w, data.h, x * scale, y * scale, scale, scale);
		}
		return gen;
	}
};

//#endregion
//#region src/client/pacman/level/level-provider.ts
var LevelProvider = class {
	constructor(w, h) {
		this.w = w;
		this.h = h;
	}
	getBitMaskFor(x, y) {
		const v = (this.getAvailability(x, y - 1) ? 1 : 0) << 0 | (this.getAvailability(x + 1, y - 1) ? 1 : 0) << 1 | (this.getAvailability(x + 1, y) ? 1 : 0) << 2 | (this.getAvailability(x + 1, y + 1) ? 1 : 0) << 3 | (this.getAvailability(x, y + 1) ? 1 : 0) << 4 | (this.getAvailability(x - 1, y + 1) ? 1 : 0) << 5 | (this.getAvailability(x - 1, y) ? 1 : 0) << 6 | (this.getAvailability(x - 1, y - 1) ? 1 : 0) << 7;
		return v;
	}
};

//#endregion
//#region src/client/pacman/level/image-level-provider.ts
var ImageLevelProvider = class extends LevelProvider {
	data;
	reader;
	constructor(img) {
		super(img.width, img.height);
		this.data = Utils.readImageData(img);
		this.reader = new TextureReader(this.data.data.buffer, this.w, this.h);
	}
	getAvailability(x, y) {
		return this.reader.getPixelColor(x, y);
	}
};

//#endregion
//#region src/client/pacman/game.ts
var PacManGame = class {
	constructor(resources$1) {
		this.resources = resources$1;
	}
	currentLevel;
	async run() {
		await this.initialize();
		await Utils.delay(6e4);
		ui.close();
	}
	async initialize() {
		ui.canvasElement.height = 800;
		ui.canvasElement.width = 1e3;
		ui.context.imageSmoothingEnabled = false;
		const levels = await network.getLevels();
		if (!levels) throw new ReferenceError("Failed to get levels");
		console.log(levels);
		const lvl = levels[Math.floor(Math.random() * levels.length)];
		const levelProvider = new ImageLevelProvider(await Utils.fetchImage(lvl.src));
		const background = LevelTextureGenerator.generate(levelProvider, this.resources, 8);
		ui.title = `Level - ${lvl.name}`;
		Utils.recompute(background.src, (buffer) => {
			const array = new Uint8ClampedArray(buffer);
			let scale = .8;
			let t = performance.now();
			for (let i = 0; i < array.length; i += 4) {
				const v = array[i] + 30;
				const isWall = array[i + 3];
				if (!isWall) continue;
				array[i + 3] = 100 + v / 2;
				array[i] = v * .5 * scale;
				array[i + 1] = v * .7 * scale;
				array[i + 2] = v * scale;
			}
			console.log(performance.now() - t);
		});
		ui.context.translate(ui.canvasWidth / 2, ui.canvasHeight / 2);
		background.scaleX = -ui.canvasWidth / background.w;
		background.scaleY = -ui.canvasHeight / background.h;
		background.render(ui.context);
	}
};

//#endregion
//#region src/client/index.ts
const resources = await Resources.From("/assets/texture-map-256x64.png");
const game = new PacManGame(resources);
game.run();

//#endregion