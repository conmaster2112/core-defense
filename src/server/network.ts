import { IncomingMessage, ServerResponse } from "node:http";
import { HttpStatusCode } from "../proto";
import { resources } from "./resources";

export class NetworkAPI {
    public async handle(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<void>{
        if(message.url?.startsWith("/api")) return await this.api(message, response);
        throw new ReferenceError("Unknown url path: " + message.url);
    }
    protected async api(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<void>{
        if(message.url === "/api/ping"){
            return this.responseWith(response, {data: null});
        }
        if(message.url === "/api/levels"){
            return this.responseWith(response, {data: resources.levels});
        }
    }
    protected responseWith(response: ServerResponse<IncomingMessage>, data: object): void{
        response.writeHead(HttpStatusCode.OK, {"content-type":"application/json"});
        response.end(JSON.stringify(data));
    }
}