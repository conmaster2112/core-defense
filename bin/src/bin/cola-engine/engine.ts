import { ColaProgram } from "./program";
import { ColaShader } from "./shader";
import { ShaderKind } from "./shader-kind";

export class ColaEngine {
    private static readonly clearBits = WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT;
    public readonly api;
    public readonly programs = new Set<ColaProgram>;
    public readonly shaders = new Set<ColaShader>;
    protected constructor(gl: WebGL2RenderingContext){
        this.api = gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    public createProgram(): ColaProgram{
        const a = ColaProgram.create(this);
        this.programs.add(a);
        return a;
    }
    public createShader(code: string, kind: ShaderKind): ColaShader{
        const handle = this.api.createShader(kind);
        if(!handle)
            throw new ReferenceError("Failed to create shader handle");
        
        const shader = ColaShader.create(this, handle, code, kind);
        this.shaders.add(shader);
        return shader;
    }
    public static fromCanvas(canvas: HTMLCanvasElement): ColaEngine{
        const context = canvas.getContext("webgl2");
        if(!context)
            throw new ReferenceError("WebGL2 is not supported . . .");
        
        return new ColaEngine(context);
    }
    public clear(): void{
        this.api.clear(ColaEngine.clearBits);
    }
    public update(): void{
        this.api.clear(ColaEngine.clearBits);
        for(const program of this.programs) program.update();
    }
}