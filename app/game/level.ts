export class BaseInfo {
    public constructor(public readonly level: number){}
    public static readonly normal: BaseInfo = new BaseInfo(1);
    public static readonly strong: BaseInfo = new BaseInfo(2);
    public static readonly fast: BaseInfo = new BaseInfo(0.5);
    public * times(n: number): Generator<BaseInfo>{
        for(let i = 0; i < n; i++) yield this;
    }

}

const {normal, fast, strong} = BaseInfo;

export const LEVELS = [
    function * Level1(): Generator<BaseInfo | number>{
        yield normal;
        yield 80;
        yield normal;
        yield 80;
        yield normal;
        yield 80;
        yield * normal.times(2);
        yield -1;
    },
    function * Level2(): Generator<BaseInfo | number>{
        yield normal;
        yield 70;
        yield normal;
        yield 70;
        yield normal;
        yield 100;
        yield strong;
        yield 100;
        yield * normal.times(2);
        yield -1;
    },
    function * Level3(): Generator<BaseInfo | number>{
        yield fast;
        yield 50;
        yield strong;
        yield fast;
        yield 50;
        yield strong;
        yield strong;
        yield 60;
        yield * normal.times(3);
        yield -1;
    },
    function * Level3(): Generator<BaseInfo | number>{
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
        yield * normal.times(4);
        yield -1;
    },
    function * Level4(): Generator<BaseInfo | number>{
        for(let i = 0; i < 10; i++){
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
        yield * normal.times(5);
        yield -1;
    },
    function * Level5(): Generator<BaseInfo | number>{
        for(let i = 0; i < 10; i++){
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
        yield * normal.times(15);
        yield -1;
    }
]

export function * INFINITY_LEVEL(): Generator<BaseInfo | number>{
    for(let i = 0; i < 100; i+=0.1) {
        yield * normal.times(i);
        yield 20;
    }
    yield -1;
}