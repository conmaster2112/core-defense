import { IncomingMessage, ServerResponse } from "node:http";

export abstract class RouteHandler {
    public constructor(public readonly route: RegExp){}
    public abstract handle(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<number>;
}
export class CustomRouteHandler extends RouteHandler{
    public handle(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<number> {throw new Error("Method not implemented.");}
    protected constructor(route: RegExp, handle: (message: IncomingMessage, response: ServerResponse<IncomingMessage>)=>Promise<number>){
        super(route);
        this.handle = handle;
    }
    public static create(route: RegExp, handle: (message: IncomingMessage, response: ServerResponse<IncomingMessage>)=>Promise<number>): CustomRouteHandler{
        return new CustomRouteHandler(route, handle);
    }
}