export class ClearColor {
    public constructor(
        protected readonly r: number, 
        protected readonly g: number,
        protected readonly b: number,
        protected readonly a: number = 1){}
    public *[Symbol.iterator](): Generator<number>{
        yield this.r;
        yield this.g;
        yield this.b;
        yield this.a;
    }
    public static readonly GRAY = new ClearColor(0.8, 0.8, 0.8, 0.8);
}