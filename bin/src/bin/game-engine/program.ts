import { panic, success } from "../../utils";
import type { EngineContext } from "./engine";
import { WebGLHandle } from "./handler";
import { Shader } from "./shader";
import { ShaderKind } from "./shader-kind";

export class EngineProgram extends WebGLHandle{
    public readonly api;
    protected readonly shaders = new Set<Shader>;
    public constructor(public readonly engine: EngineContext){
        super(engine.api.createProgram());
        this.api = engine.api;
    }
    public createShader(code: string, kind: ShaderKind): number{
        const shader = this.engine.createShader(code, kind);
        
        if(shader.compile())
            return panic("Failed to compile shader");

        this.attachShader(shader);
        return success();
    }
    public attachShader(shader: Shader): void{
        this.shaders.add(shader);
        this.api.attachShader(this.getHandle(), shader.getHandle());
    }
    public link(): number{
        const h = this.getHandle();
        this.api.linkProgram(h);
        if(!this.api.getProgramParameter(h, WebGL2RenderingContext.LINK_STATUS)){
            const m = this.api.getProgramInfoLog(h);
            return panic(m??"Failed to link program, with no error log");
        }
        return success();
    }
    public use(): void{
        this.api.useProgram(this.handle);
    }
}