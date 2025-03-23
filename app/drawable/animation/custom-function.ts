import { AnimationFunction } from "./state";

const {sin, PI} = Math;
const QU = PI / 2;
export class AnimationCustomFunctionChain extends AnimationFunction {
    public constructor(
        public readonly nodes: Array<(t: number)=>number>
    ){
        super();
    }
    public reset = undefined;
    public pass(d: number): number { 
        for(let i = 0; i < this.nodes.length; i++) d = this.nodes[i](d);
        return d;
    }
    public chain(node: (t: number)=>number): this {
        this.nodes.push(node);
        return this;
    }
}
export class AnimationNodeTypes {
    private constructor(){}
    public static readonly sineNode: (t: number)=>number = (t: number)=>sin(QU * t);
    public static readonly quadraticNode: (t: number)=>number = (t: number)=>t**2;
    public static readonly inverseNode: (t: number)=>number = (t: number)=>1 - t;
    public static create(...nodes: Array<(t: number)=>number>): AnimationCustomFunctionChain { return new AnimationCustomFunctionChain(nodes); }
}