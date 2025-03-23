import { readFile, writeFile } from "node:fs/promises";
import { LevelInfo } from "../../shared";

export class ServerResources {
    public readonly file;
    public readonly levels: LevelInfo[] = [];
    public readonly textureMap: string = "<empty>";
    public constructor(file: string){
        this.file = file;
        Reflect.defineProperty(this, "file", {value:file, writable: false});
    }
    public async save(): Promise<void>{ await writeFile(this.file, JSON.stringify(this, null, 3)); }
    public async load(): Promise<void>{ Object.assign(this, JSON.parse(((await readFile(this.file).catch(e=>null)))?.toString("utf-8")??"{}"));}
}
export const resources = new ServerResources("./resources.json");