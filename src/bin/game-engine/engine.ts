import { ClearColor } from "./color";
import { EngineProgram } from "./program";
import { Shader } from "./shader";
import { ShaderKind } from "./shader-kind";

export class EngineContext {
    private static readonly clearBits = WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT; 
    protected clearColor: ClearColor = new ClearColor(0,0,0,0);
    public readonly api;
    public readonly programs = new Set<EngineProgram>;
    public readonly shaders = new Set<Shader>;
    protected constructor(gl: WebGL2RenderingContext){
        this.api = gl;
        this.setClearColor(this.clearColor);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    public createProgram(): EngineProgram{
        const a = new EngineProgram(this);
        this.programs.add(a);
        return a;
    }
    public createShader(code: string, kind: ShaderKind): Shader{
        const handler = this.api.createShader(kind);
        if(!handler)
            throw new ReferenceError("Failed to create shader handle");
        
        const shader = Shader.create(this, handler);
        shader.setSourceCode(code);

        this.shaders.add(shader);
        return shader;
    }
    public static fromCanvas(canvas: HTMLCanvasElement): EngineContext{
        const context = canvas.getContext("webgl2");
        if(!context)
            throw new ReferenceError("WebGL2 is not supported . . .");
        
        return new EngineContext(context);
    }
    public setClearColor(color: ClearColor): void{
        this.clearColor = color;
        // @ts-expect-error
        this.api.clearColor(...this.clearColor);
    }
    public clear(): void{
        this.api.clear(EngineContext.clearBits);
    }
    public update(): void{
        for(const program of this.programs) program.update();
    }
}