import { PacketType } from "./type";

export abstract class BasePacket<T extends BasePacketData | null> {
    public constructor(type: PacketType, data: T){
        this.type = type;
        this.data = data;
    }
    public type: PacketType = PacketType.Unknown;
    public data: T;
    toJSON(): object{
        return {type: this.type, data: this.data??null};
    }
    public abstract handle(data: T): Promise<HandlerResult<unknown>>;
}
export abstract class BasePacketData {
    private static __types = new Map<PacketType, (new ()=>BasePacketData)>();
    public static register(this: (new ()=>BasePacketData) & {readonly type: PacketType}): void{
        BasePacketData.__types.set(this.type, this);
    }
}

export class HandlerResult<T = null> {
    public readonly code: number;
    public readonly data: T;
    public constructor(code: number, data: T){
        this.code = code;
        this.data = data;
    }
}