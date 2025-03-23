import { Port } from "./port";

export class ClientPort extends Port {
    public readonly pingInterval = 3_000; //3s
    public readonly id;
    protected constructor(id: string){
        super(async (b)=>{
            console.log("Handle packet");
            return 1;
        });
        this.id = id;
    }
    public static create(): ClientPort{
        return new ClientPort("hah")
    }
}