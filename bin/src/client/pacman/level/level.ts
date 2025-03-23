import { ui } from "../../managers";
import type { PacManGame } from "../game";
import type { LevelProvider } from "./level-provider";
import { LevelTextureGenerator } from "./level-texture-generator";

export class Level {
    public name: string;
    public background?: LevelTextureGenerator;
    public constructor(
        public readonly game: PacManGame,
        public readonly levelId: number,
        public readonly provider: LevelProvider){
        this.name = `Level ${levelId};`;
    }
    public async initialize(): Promise<void>{
        this.background ??= LevelTextureGenerator.generate(this.provider, this.game.resources, 8);
        this.background.scaleX = ui.canvasWidth / this.background.w;
        this.background.scaleY = ui.canvasHeight / this.background.h;
        console.log("Level Started");
    }
    public getCollision(x: number, y: number): boolean{
        return this.provider.getAvailability(x, y) > 0;
    }
}