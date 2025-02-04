import { TextureMap, TextureSource } from "../texture";
import { Utils } from "../utils";import { LevelMapper } from "./level";
;

export class Resources {
    protected constructor(
        public readonly textureMap: TextureMap,
        public readonly collisionTextureSet: Record<number, TextureSource>){
    }
    public static async From(src: string): Promise<Resources>{
        const img = await Utils.fetchImage(src);
        const map = new TextureMap(img);
        const set = LevelMapper.createTextureMap(map, 17, 8);
        return new Resources(map, set);
    }
}