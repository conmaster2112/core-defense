import { DEFAULT_ADDRESS, DEFAULT_PORT } from "../proto";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { HttpStatusCode } from "../proto";
import { delay } from "../utils";

export abstract class Server {
    public readonly server;
    public readonly url;
    protected constructor(public readonly port: number, public readonly address: string){
        this.server = createServer(this.__handle__.bind(this));
        this.url = `http://${address}:${port}`
    }
    public bind(): Promise<void>{
        return new Promise(res=>this.server.listen(this.port, this.address, res));
    }
    public static create<T extends Server>(this: new (port: number, address: string)=>T,port?: number, address?: string): T{
        return new this(port??DEFAULT_PORT, address??DEFAULT_ADDRESS);
    }
    /*
    public routeAPI(path: string, handler:()=>void): this{
        return this;
    }
    public routeDirectory(path: RegExp, nameResolve?: (originalPath: string)=>string | null): this{
        const route = CustomRouteHandler.create(path, async (m, r)=>{
            let url = String(m.url);
            const path = nameResolve?nameResolve(url):existsSync("." + url)?"." + url:null;
            console.log(path, url);
            if(!path){
                r.writeHead(HttpStatusCode.NotFound);
                r.end();
                return warn("Routed file found: " + url);
            }
            const contentType = getContentType(path);
            if(!contentType){
                r.writeHead(HttpStatusCode.NotFound);
                r.end();
                return warn("Unknown content type fot this file: " + url);
            }
            const data = await readFile(path).catch(e=>(panic(String(e)),null));
            if(!data){
                r.writeHead(HttpStatusCode.NotFound);
                r.end();
                return warn("Failed to read file: " + url);
            }
            r.writeHead(HttpStatusCode.OK, {"content-type":contentType});
            r.end(data);
            return success();
        });
        this.routers.add(route);
        return this;
    }*/
    private async __handle__(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<void>{
        await this.handle(message, response).catch(e=>{
            console.error(e, e.message);
            if(response.closed) return;
            response.writeHead(HttpStatusCode.NotFound);
            response.end("404: Invalid url path");
        });
    }
    protected abstract handle(message: IncomingMessage, response: ServerResponse<IncomingMessage>): Promise<void>;
}

const headers = {host: '127.0.0.1:4000',connection: 'keep-alive','sec-fetch-site': 'none','sec-fetch-mode': 'navigate','sec-fetch-dest': 'empty',referer: 'http://127.0.0.1:4000/','user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0','accept-encoding': 'gzip, deflate, br, zstd','accept-language': 'cs'};