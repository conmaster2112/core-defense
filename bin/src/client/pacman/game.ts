import { Utils } from "../../../../app/utils";
import { Level } from "./level/level";
import { Resources } from "./resources";
import { network, ui } from "../managers";
import { ImageLevelProvider } from "./level";
import { PacMan } from "./strides";

export class PacManGame {
    public constructor(public readonly resources: Resources){}
    public currentLevel?: Level;
    public async run(): Promise<void>{
        await this.initialize();
        await Utils.delay(60_000);
        ui.close();
    }
    protected async initialize(): Promise<void>{
        Utils.isDebug = true;
        ui.canvasElement.height = 800;
        ui.canvasElement.width = 1000;
        ui.context.imageSmoothingEnabled = false;
        const levels = await network.getLevels();
        if(!levels)
            throw new ReferenceError("Failed to get levels");



        const lvl = levels[1];



        this.currentLevel = new Level(this, levels.indexOf(lvl), new ImageLevelProvider(await Utils.fetchImage(lvl.src)));
        this.currentLevel.initialize();
        this.currentLevel.name = lvl.name!;



        Utils.recompute(this.currentLevel.background!.src, (buffer)=>{
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
        const background = this.currentLevel.background!;




        const pacman = new PacMan(this.resources.textureMap.getFrameTexture(0, 0, 8, 8, 4));
        pacman.scaleX = (ui.canvasWidth / background.w)*0.8;
        pacman.scaleY = (ui.canvasHeight / background.h)*0.8;
        pacman.rotation = 0; //-Math.PI / 2;
        pacman.texture.currentFrame++;
        //ui.context.drawImage(background.src, 0, 0);
        const partX = (background.scaleX * background.scale);
        const partY = (background.scaleY * background.scale);
        pacman.position.x = -partX * 3;
        pacman.position.y = partY;
        //ui.context.rotate(Math.PI / 2);
        ui.context.translate(ui.canvasWidth / 2, ui.canvasHeight / 2);
        background.render(ui.context);
        pacman.render(ui.context);

    }

    protected __update__(): void {
        
    }
}