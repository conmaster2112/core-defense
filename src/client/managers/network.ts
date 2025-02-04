import { LevelInfo } from "../../../shared";

export class NetworkManager {
    public async ping(): Promise<boolean>{
        return!await this.fetchJSON("/api/ping");
    }
    public async getLevels(): Promise<LevelInfo[] | null>{
        return await this.fetchJSON<{data:LevelInfo[]}>("/api/levels").then(e=>e?.data??null);
    }
    protected async fetchJSON<T>(url: string): Promise<T | null>{
        const response = await fetch(url).catch(()=>null);
        if(!response || !response.ok) return null;
        return await response.json().catch(e=>null) as T;
    }
}
export const network = new NetworkManager();