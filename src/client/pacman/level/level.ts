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
    public async start(): Promise<void>{
        this.background ??= LevelTextureGenerator.generate(this.provider, this.game.resources);
        console.log("Level Started");
    }
}