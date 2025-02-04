import { panic, success } from "../../utils";
import type { EngineContext } from "./engine";
import { WebGLHandle } from "./handler";

export class Shader extends WebGLHandle {
    public readonly api;
    protected constructor(
        public readonly context: EngineContext,
        handle: WebGLShader
    ){
        super(handle);
        this.api = context.api;
    }
    public setSourceCode(src: string): void{
        this.api.shaderSource(this.handle, src);
    }
    public compile(): number{
        this.api.compileShader(this.handle);
        if(!this.api.getShaderParameter(this.handle, WebGL2RenderingContext.COMPILE_STATUS)){
            const compileError = this.api.getShaderInfoLog(this.handle);
            return panic(compileError??"Failed to compile shader, with unknown error");
        }
        return success();
    }
    // public api
    public static create(context: EngineContext, handle: WebGLShader): Shader{return new Shader(context, handle)}
}