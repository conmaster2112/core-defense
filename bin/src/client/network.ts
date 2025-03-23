import { EventHandler } from "../utils";
import { Game } from "./game";

export class Network{
    public constructor(public readonly game: Game){}
    public async tick(): Promise<void>{
        await this.ping();
    }
    protected async ping(): Promise<void>{
        const response = await fetch("/api/ping").catch(()=>null);
        if(!response || !response.ok) {
            this.onConnectionLost.trigger();
            throw new ReferenceError("Connection lost");
        }
        const {data} = await response.json();
        if(data) console.log(data);
    }
    public readonly onConnectionLost = new EventHandler<[]>();
}