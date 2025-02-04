import { BasePacket, HandlerResult } from "./base";
import { PacketType } from "./type";

export class PingPacket extends BasePacket<null>{
    public constructor(){super(PacketType.Ping, null);}
    public async handle(_: null): Promise<HandlerResult<unknown>> {
        return new HandlerResult(200, null);
    }
}