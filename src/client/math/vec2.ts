interface Vec2Constructor {
    new (x: number, y: number): Vec2;
    (x: number, y: number): Vec2;
    readonly prototype: Vec2;

    /**
     * Adds two vectors.
     */
    add(vec1: Vec2Like, vec2: Vec2Like): Vec2;

    /**
     * Adds a vector and a scalar.
     */
    add(vec: Vec2Like, scalar: number): Vec2;

    /**
     * Subtracts the second vector from the first vector.
     */
    subtract(vec1: Vec2Like, vec2: Vec2Like): Vec2;

    /**
     * Subtracts a scalar from a vector.
     */
    subtract(vec: Vec2Like, scalar: number): Vec2;

    /**
     * Multiplies a vector by a scalar.
     */
    multiplyS(vec: Vec2Like, scalar: number): Vec2;

    /**
     * Multiplies a vector by a scalar.
     */
    multiply(vec: Vec2Like, scalar: Vec2Like): Vec2;

    /**
     * Divides a vector by a scalar.
     */
    divide(vec: Vec2Like, scalar: number): Vec2;

    /**
     * Calculates the dot product of two vectors.
     */
    dotProduct(vec1: Vec2Like, vec2: Vec2Like): number;

    /**
     * Reflects a vector off a normal.
     */
    reflect(vec: Vec2Like, normal: Vec2Like): Vec2;

    /**
     * Calculates the magnitude of a vector.
     */
    magnitude(vec: Vec2Like): number;

    /**
     * Normalizes a vector.
     */
    normalize(vec: Vec2Like): Vec2;

    /**
     * Calculates the distance between two vectors.
     */
    distance(vec1: Vec2Like, vec2: Vec2Like): number;

    /**
     * Calculates the angle between two vectors.
     */
    angle(vec1: Vec2Like, vec2: Vec2Like): number;

    /**
     * Linearly interpolates between two vectors.
     */
    lerp(vec1: Vec2Like, vec2: Vec2Like, t: number): Vec2;

    /**
     * Rotates a vector by a given angle.
     */
    rotate(vec: Vec2Like, angle: number): Vec2;
}

interface Vec2Like {
    x: number;
    y: number;
}

export interface Vec2 extends Vec2Like {
    /**
     * Adds this vector to another vector.
     */
    add(vec: Vec2Like): Vec2;

    /**
     * Adds this vector to a scalar.
     */
    add(scalar: number): Vec2;

    /**
     * Subtracts another vector from this vector.
     */
    subtract(vec: Vec2Like): Vec2;

    /**
     * Subtracts a scalar from this vector.
     */
    subtract(scalar: number): Vec2;

    /**
     * Multiplies this vector by a scalar.
     */
    multiplyS(scalar: number): Vec2;
    /**
     * Multiplies a vector by a scalar.
     */
    multiply(vec: Vec2Like): Vec2;

    /**
     * Divides this vector by a scalar.
     */
    divide(scalar: number): Vec2;

    /**
     * Calculates the dot product of this vector and another vector.
     */
    dotProduct(vec: Vec2Like): number;

    /**
     * Reflects this vector off a normal.
     */
    reflect(normal: Vec2Like): Vec2;

    /**
     * Calculates the magnitude of this vector.
     */
    magnitude(): number;

    /**
     * Normalizes this vector.
     */
    normalize(): Vec2;

    /**
     * Calculates the distance between this vector and another vector.
     */
    distance(vec: Vec2Like): number;

    /**
     * Calculates the angle between this vector and another vector.
     */
    angle(vec: Vec2Like): number;

    /**
     * Linearly interpolates between this vector and another vector.
     */
    lerp(vec: Vec2Like, t: number): Vec2;

    /**
     * Rotates this vector by a given angle.
     */
    rotate(angle: number): Vec2;
}

const sP = Object.setPrototypeOf;
export const Vec2: Vec2Constructor = function Vec2(x: number, y: number) {
    return sP({ x, y }, new.target?.prototype ?? Vec2.prototype);
} as unknown as Vec2Constructor;

Vec2.add = function add(vec1: Vec2Like, vec2OrScalar: Vec2Like | number): Vec2 {
    if (typeof vec2OrScalar === 'number') {
        return sP({ x: vec1.x + vec2OrScalar, y: vec1.y + vec2OrScalar }, Vec2.prototype);
    }
    return sP({ x: vec1.x + vec2OrScalar.x, y: vec1.y + vec2OrScalar.y }, Vec2.prototype);
};

Vec2.prototype.add = function add(this: Vec2Like, vecOrScalar: Vec2Like | number): Vec2 {
    return Vec2.add(this, vecOrScalar as any);
};

Vec2.subtract = function subtract(vec1: Vec2Like, vec2OrScalar: Vec2Like | number): Vec2 {
    if (typeof vec2OrScalar === 'number') {
        return sP({ x: vec1.x - vec2OrScalar, y: vec1.y - vec2OrScalar }, Vec2.prototype);
    }
    return sP({ x: vec1.x - vec2OrScalar.x, y: vec1.y - vec2OrScalar.y }, Vec2.prototype);
};

Vec2.prototype.subtract = function subtract(this: Vec2Like, vecOrScalar: Vec2Like | number): Vec2 {
    return Vec2.subtract(this, vecOrScalar as any);
};

Vec2.multiplyS = function multiply(vec: Vec2Like, scalar: number): Vec2 {
    return sP({ x: vec.x * scalar, y: vec.y * scalar }, Vec2.prototype);
};

Vec2.prototype.multiply = function multiply(this: Vec2Like, vec: Vec2Like): Vec2 {
    return Vec2.multiply(this, vec);
};
Vec2.multiply = function multiply(vec: Vec2Like, vec2: Vec2Like): Vec2 {
    return sP({ x: vec.x * vec2.x, y: vec.y * vec2.y }, Vec2.prototype);
};

Vec2.prototype.multiplyS = function multiply(this: Vec2Like, scalar: number): Vec2 {
    return Vec2.multiplyS(this, scalar);
};

Vec2.divide = function divide(vec: Vec2Like, scalar: number): Vec2 {
    return sP({ x: vec.x / scalar, y: vec.y / scalar }, Vec2.prototype);
};

Vec2.prototype.divide = function divide(this: Vec2Like, scalar: number): Vec2 {
    return Vec2.divide(this, scalar);
};

Vec2.dotProduct = function dotProduct(vec1: Vec2Like, vec2: Vec2Like): number {
    return vec1.x * vec2.x + vec1.y * vec2.y;
};

Vec2.prototype.dotProduct = function dotProduct(this: Vec2Like, vec: Vec2Like): number {
    return Vec2.dotProduct(this, vec);
};

Vec2.reflect = function reflect(vec: Vec2Like, normal: Vec2Like): Vec2 {
    const dotProduct = Vec2.dotProduct(vec, normal);
    return sP(
        {
            x: vec.x - 2 * dotProduct * normal.x,
            y: vec.y - 2 * dotProduct * normal.y,
        },
        Vec2.prototype
    );
};

Vec2.prototype.reflect = function reflect(this: Vec2Like, normal: Vec2Like): Vec2 {
    return Vec2.reflect(this, normal);
};

Vec2.magnitude = function magnitude(vec: Vec2Like): number {
    return Math.sqrt(vec.x ** 2 + vec.y ** 2);
};

Vec2.prototype.magnitude = function magnitude(this: Vec2Like): number {
    return Vec2.magnitude(this);
};

Vec2.normalize = function normalize(vec: Vec2Like): Vec2 {
    const mag = Vec2.magnitude(vec);
    return sP({ x: vec.x / mag, y: vec.y / mag }, Vec2.prototype);
};

Vec2.prototype.normalize = function normalize(this: Vec2Like): Vec2 {
    return Vec2.normalize(this);
};

Vec2.distance = function distance(vec1: Vec2Like, vec2: Vec2Like): number {
    return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2);
};

Vec2.prototype.distance = function distance(this: Vec2Like, vec: Vec2Like): number {
    return Vec2.distance(this, vec);
};

Vec2.angle = function angle(vec1: Vec2Like, vec2: Vec2Like): number {
    const dotProduct = Vec2.dotProduct(vec1, vec2);
    const magnitudes = Vec2.magnitude(vec1) * Vec2.magnitude(vec2);
    return Math.acos(dotProduct / magnitudes);
};

Vec2.prototype.angle = function angle(this: Vec2Like, vec: Vec2Like): number {
    return Vec2.angle(this, vec);
};

Vec2.lerp = function lerp(vec1: Vec2Like, vec2: Vec2Like, t: number): Vec2 {
    return sP(
        {
            x: vec1.x + (vec2.x - vec1.x) * t,
            y: vec1.y + (vec2.y - vec1.y) * t,
        },
        Vec2.prototype
    );
};

Vec2.prototype.lerp = function lerp(this: Vec2Like, vec: Vec2Like, t: number): Vec2 {
    return Vec2.lerp(this, vec, t);
};

Vec2.rotate = function rotate(vec: Vec2Like, angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return sP(
        {
            x: vec.x * cos - vec.y * sin,
            y: vec.x * sin + vec.y * cos,
        },
        Vec2.prototype
    );
};

Vec2.prototype.rotate = function rotate(this: Vec2Like, angle: number): Vec2 {
    return Vec2.rotate(this, angle);
};