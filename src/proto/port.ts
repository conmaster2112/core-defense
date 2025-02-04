import { panic } from "../utils";
import { BasePacket } from "./packets/base";

export class Port {
    public readonly handler;
    protected constructor(handler: (p: BasePacket<any>)=>Promise<number>){
        this.handler = handler;
    }
    protected async processPayload(data: object): Promise<number>{
        if(!data || typeof data !== "object") return panic("Failed to process payload, payload is not type of object");
        if(!("type" in data))
            return panic("Packet doesn't have type property, " + JSON.stringify(data))
        
        return this.handler(data as BasePacket<any>).catch(e=>panic("Failed to call packet handler"));
    }
}