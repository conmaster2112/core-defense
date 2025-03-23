import { EventHandler } from "../../utils";
import { Vec2 } from "../../../../app/math";
import { Network } from "../network";
import { BaseRenderLoop } from "../render-engine";
import { RenderingEngine } from "../render-engine/renderer";
import { TextureSource } from "../../../../app/texture/texture";
//import { getImgData, LoadImg } from "../utils";
import { TextureReader } from "../../../../app/texture/texture-reader";
import { InputManager } from "../managers/input";


const img2 = await LoadImg("/assets/level0.png");
const data = getImgData(img2);

export class Game {
    public readonly onTick = new EventHandler();
    public readonly ui = new UIManger(this, document);
    public readonly network = new Network(this);
    public readonly renderEngine = new RenderingEngine(this.ui.context);
    public readonly render = new BaseRenderLoop(this, 200, false, 0.9);
    public readonly input = new InputManager(this);
    public readonly gameLevel = new TextureReader(data.data.buffer, data.width, data.height);
    public readonly frame: ()=>void;
    public background: TextureSource | null = null;
    public constructor(){
        this.network.onConnectionLost.subscribe(()=>window.close());
        this.render.scale = this.ui.scale;
        this.render.ratio = this.ui.ratio;
        const zero = Vec2(0,0);
        this.frame = ((): void=>{
            this.renderEngine.reset();
            this.renderEngine.drawTexture(this.background!.getTextureData(), zero, this.ui.scale);
            this.render.render();
            requestAnimationFrame(this.frame);
        })
        //requestAnimationFrame(this.frame);
    }
    public start(): void{
        if(this.background === null)
            throw ReferenceError("No background specified");

        setInterval(()=>{
            this.network.tick();
        }, 1000);
        setInterval(()=>{
            this.onTick.trigger();
            this.render.tick();
            this.frame();
        }, this.render.tickSpeed);
        this.ui.onResize.subscribe(()=>this.frame()) as ()=>void;
    }
}