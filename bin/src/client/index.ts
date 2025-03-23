import { PacManGame, Resources } from "./pacman";
import { Utils } from "../../../app/utils";

Utils.isDebug = true;
const resources = await Resources.From("/assets/texture-map-256x64.png");
const game = new PacManGame(resources);
game.run();



/*import { Game, TextureReader } from "./game";
import { BackgroundImageBuilder } from "./game/background-builder";
import { Vec2 } from "./math";
import { RectImgStride } from "./render-engine/rect";
import { FrameTexture, TextureMap } from "./texture";
import { LevelMapper } from "./pacman/level-mapper";

const baseTextureMap = await TextureMap.FromSrc("/assets/texture-map-256x64.png");
const game = new Game();
const background = new BackgroundImageBuilder(await TextureReader.FromSrc("/assets/level0.png"));
const textureSet = LevelMapper.createTextureSet(baseTextureMap);
background.generate(textureSet);
const data = background.getRawData();
for(let i = 0; i < data.length; i+=4){
    if(!data[i+3]) continue;
    let v = data[i] / 255;
    data[i] = 120 - (i / data.length) * 100;
    data[i+1] = 100 + (i / data.length) * 100;//data[i + 1] ** 0.5;
    data[i+2] = 255;//data[i + 2] ** 0.3;
    data[i+3] = (0.1 + v * 0.6) * 255;
}
background.setRawData(data);
game.background = background;
console.log(baseTextureMap);


const rect = new RectImgStride<FrameTexture>(Vec2((1 - 0.1) / 25, (1 - 0.1) / 15 ), baseTextureMap.getFrameTexture(0, 0, 8, 8, 4));

setInterval(()=>rect.texture.currentFrame++, 200);


rect.velocity = Vec2(0.01,0.04);


game.render.models.add(rect);
game.start();

const pKeys = game.input.pressedKeys;


game.onTick.subscribe(()=>{
    if(pKeys["ArrowLeft"]) {
        rect.velocity.x = Math.max(rect.velocity.x += -0.008, -0.03);
    }
    if(pKeys["ArrowRight"]) rect.velocity.x = Math.min(rect.velocity.x += 0.008, 0.03);
    if(pKeys[" "]) rect.velocity.y -= 0.006;
});
console.log("stride added");
window.addEventListener("click", () => {rect.velocity.y -= 0.08; });
window.addEventListener("contextmenu", (e)=>e.preventDefault());*/