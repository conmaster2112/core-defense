import { panic, success } from "../../utils";
import { ColaEngine } from "./engine";
import { ColaHandle } from "./handle";
import { ColaShader } from "./shader";

export class ColaProgram extends ColaHandle {
    public static create(engine: ColaEngine): ColaProgram { return new this(engine); }

    public readonly api;
    public readonly shaders = new Set<ColaShader>();
    protected constructor(public readonly engine: ColaEngine) {
        super(engine.api.createProgram());
        this.api = engine.api;
    }
    public update(): void {

    }
    public attachShader(shader: ColaShader): void {
        this.shaders.add(shader);
        this.api.attachShader(this.handle, shader.handle);
    }
    public link(): number {
        for(const sh of this.shaders){
            if(sh.isCompiled) continue;
            let failed = sh.compile();
            if(failed)
                return panic("Failed link program, because shaders failed to compile.");
        }

        this.api.linkProgram(this.handle);
        if (!this.api.getProgramParameter(this.handle, WebGL2RenderingContext.LINK_STATUS)) {
            const m = this.api.getProgramInfoLog(this.handle);
            return panic(m ?? "Failed to link program, with no error log");
        }
        return success();
    }
}