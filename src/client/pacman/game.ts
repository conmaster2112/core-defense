import { Utils } from "../utils";
import { Level } from "./level/level";
import { LevelRenderer } from "./level/level-renderer";
import { Resources } from "./resources";
import { network, ui } from "../managers";
import { ImageLevelProvider } from "./level";
import { LevelTextureGenerator } from "./level/level-texture-generator";
import { Network } from "../network";

export class PacManGame {
    public constructor(public readonly resources: Resources){}
    public currentLevel?: Level;
    public async run(): Promise<void>{
        await this.initialize();
        await Utils.delay(60_000);
        ui.close();
    }
    protected async initialize(): Promise<void>{
        ui.canvasElement.height = 800;
        ui.canvasElement.width = 1000;
        ui.context.imageSmoothingEnabled = false;
        const levels = await network.getLevels();
        if(!levels)
            throw new ReferenceError("Failed to get levels");
        console.log(levels);

        const lvl = levels[Math.floor(Math.random() * levels.length)];
        
        const levelProvider = new ImageLevelProvider(await Utils.fetchImage(lvl.src));
        const background = LevelTextureGenerator.generate(levelProvider, this.resources, 8);
        ui.title = `Level - ${lvl.name}`;
        Utils.recompute(background.src, (buffer)=>{
            const array = new Uint8ClampedArray(buffer);
            let scale = 0.8;
            let t = performance.now();
            for(let i = 0; i < array.length; i+=4){
                const v = array[i] + 30; //Red
                const isWall = array[i + 3]; //Alpha
                if(!isWall) continue;
                array[i + 3] = 100 + (v / 2);
                array[i] = v * 0.5 * scale;
                array[i + 1] = v * 0.7 * scale;
                array[i + 2] = v * scale;
            }
            console.log(performance.now() - t);
        });
        //ui.context.drawImage(background.src, 0, 0);
        ui.context.translate(ui.canvasWidth / 2, ui.canvasHeight / 2);
        background.scaleX = -ui.canvasWidth / background.w;
        background.scaleY = -ui.canvasHeight / background.h;
        //ui.context.rotate(Math.PI / 2);
        background.render(ui.context);
    }
}