import { TextureSource } from "../../texture";

export class LevelRenderer {
    public constructor(public readonly context: CanvasRenderingContext2D){}
    public background: TextureSource;
    public render(): void{
        this.context.reset();
        this.background.render(this.context);
    }
}