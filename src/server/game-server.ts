import { IncomingMessage, ServerResponse } from "node:http";
import { panic, success } from "../utils";
import { Server } from "./server";
import { getContentType } from "../proto/content-types";
import { AssetPathKind, HttpStatusCode } from "../proto";
import { readFile } from "fs/promises";
import { NetworkAPI } from "./network";
import { resolve } from "node:path";

export class GameServer extends Server {
    public readonly api = new NetworkAPI();
    public constructor(port: number, address: string){
        super(port, address);
    }
    public async start(): Promise<number>{
        await this.bind();
        return success();
    }
    protected async handle(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<void> {
        if(message.url === "/") return await this.sendFile(response, AssetPathKind.ClientIndex);
        else if(message.url === "/favicon.ico") return await this.sendFile(response, AssetPathKind.IconIco);
        else if(message.url === "/__APPLICATION__") return await this.sendFile(response, AssetPathKind.ClientApplication);
        else if(message.url === "/__STYLES__") return await this.sendFile(response, AssetPathKind.ClientStyles);
        else if(message.url?.startsWith("/api")) return await this.api.handle(message, response);
        else if(message.url?.startsWith("/assets")) return await this.sendFile(response, resolve("." + message.url));
        response.writeHead(HttpStatusCode.BadRequest, "Bad request invalid url");
        response.end();
    }
    protected async sendFile(response: ServerResponse<IncomingMessage>, file: string): Promise<void>{
        const cType = getContentType(file);
        if(!cType)
            return this.fileNotFound(response, file);

        const data = await this.readFile(file);
        if(!data){
            this.fileNotFound(response, file);
            panic("Failed to read file: " + file);
            return;
        }

        response.writeHead(HttpStatusCode.OK, {
            "content-type": cType,
            "Cross-Origin-Opener-Policy":"same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp"
        });
        response.end(data);
    }
    protected readFile(file: string): Promise<Buffer | null>{
        return readFile(file).catch(()=>null);
    }
    protected fileNotFound(response: ServerResponse<IncomingMessage>, file: string): void{
        response.writeHead(HttpStatusCode.NotFound);
        response.end("File not found: " + file);
    }
}