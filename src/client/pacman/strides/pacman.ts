import { TextureSource } from "../../texture";
import { Entity } from "./entity";

export class PacMan<T extends TextureSource> extends Entity<T> {
    public constructor(texture: T){
        super(5, texture);
    }
}