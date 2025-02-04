import { panic, success } from "../../utils";
import { ColaEngine } from "./engine";
import { ColaHandle } from "./handle";
import { ShaderKind } from "./shader-kind";

export class ColaShader extends ColaHandle{
    public readonly api;
    public get isCompiled(): boolean{return this.__isCompiled;}
    protected __isCompiled = false;
    protected constructor(
        public readonly engine: ColaEngine,
        handle: object,
        public readonly src: string,
        public readonly kind: ShaderKind
    ){
        super(handle);
        this.api = engine.api;
        this.api.shaderSource(this.handle, src);
    }
    public compile(): number{
        this.api.compileShader(this.handle);
        if(!this.api.getShaderParameter(this.handle, WebGL2RenderingContext.COMPILE_STATUS)){
            const compileError = this.api.getShaderInfoLog(this.handle);
            return panic(compileError??"Failed to compile shader, with unknown error");
        }
        this.__isCompiled;
        return success();
    }
    public static create(engine: ColaEngine, handle: object, code: string, kind: ShaderKind): ColaShader{
        return new this(engine, handle, code, kind);
    }
}