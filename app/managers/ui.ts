import { ElementIds } from "../element-id";

function getValue(id: string): object | null{
    let v = localStorage[id];
    if(v) return JSON.parse(v);
    return null;
}
export class UIManager {
    public static getElement<T extends HTMLElement>(id: string): T{
        const e = document.getElementById(id);
        if(!e) throw new ReferenceError("Failed to get element with id of " + id);
        return e! as T;
    }
    public readonly canvasElement;
    public readonly titleElement;
    public readonly bodyElement: HTMLBodyElement;
    public readonly context: CanvasRenderingContext2D;
    public readonly tableTitles = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableTitles);
    public readonly tableValues = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableValues);
    public readonly tableButtons = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableButtons);
    public readonly statsDiv = UIManager.getElement<HTMLDivElement>(ElementIds.Stats);
    public clientWidth: number = 0;
    public clientHeight: number = 0;
    public constructor(){
        this.canvasElement = UIManager.getElement<HTMLCanvasElement>(ElementIds.ViewportCanvas);
        this.titleElement = UIManager.getElement<HTMLTitleElement>(ElementIds.WindowTitle);
        this.bodyElement = document.body! as HTMLBodyElement;
        this.context = this.canvasElement.getContext("2d")!;
        if(!this.context)
            throw new ReferenceError("Failed to get context from canvas");

        this.title = "PacMan lite"
        window.addEventListener("resize", ()=>this.__update());
        this.__update();
    }
    public get title(): string{return this.titleElement.textContent!;}
    public set title(v: string){ this.titleElement.textContent = v;}
    public get canvasWidth(): number{return this.canvasElement.width;}
    public get canvasHeight(): number{return this.canvasElement.height;}
    protected __update(): void{
        this.clientWidth  = this.bodyElement.clientWidth;
        this.clientHeight = this.bodyElement.clientHeight;
    }
    public close(): void {window.close();}
    public setWindowSize(width: number, height: number): void{window.resizeTo(width, height);}
    public newCanvas(): HTMLCanvasElement
    {return document.createElement("canvas")!;}
    
    public static createElement<T extends HTMLElement>(type: string, text: string): T{
        let th = document.createElement(type);
        th.textContent = text;
        return th as unknown as T;
    }
}
export const uiManager = new UIManager();

export class Saveable<T extends object> {
    protected object: Partial<T> = {};
    protected constructor(public readonly id: string){
        const v = getValue(id);
        Object.assign(this.object, v??{});
    }
    protected save(): void{
        localStorage[this.id] = JSON.stringify(this.object);
    }
    protected toJSON(): object{
        return this.object;
    }
}
export class GameProperty extends Saveable<{value: number, level: number}>{
    public set value(v: number){
        this.htmlValueElement.textContent = String((this.object.value = v).toFixed(2));
        this.save();
    }
    public get value(): number {return this.object.value??0;}
    public htmlValueElement: HTMLElement;
    public htmlButtonElement: HTMLButtonElement;
    public set level(v: number) {
        this.object.level = v;
        this.save();
    }
    public get level(): number {return this.object.level??0;}
    public constructor(
        id: string,
        public readonly name: string,
        value: number,
        public readonly initialCost: number,
        public readonly incrementalMultiplier: number,
        public readonly unit: number,
        public readonly max: number
    ){
        super(id);
        uiManager.tableTitles.appendChild(UIManager.createElement("th",name));
        uiManager.tableValues.appendChild(this.htmlValueElement = UIManager.createElement("td",String(value)));
        const [buttonElement, _th] = GameProperty.createButton();
        uiManager.tableButtons.appendChild(_th);
        this.htmlButtonElement = buttonElement;
        this.value = this.object.value??value;
        this.level = this.object.level??0;
        buttonElement.textContent = `Upgrade ${this.getConst().toFixed(0)}$`
        buttonElement.onclick = (): void=>{
            const cost = this.getConst();
            if(cost < infoProperties.electrons.value){
                infoProperties.electrons.value-=cost;
                this.level++;
                buttonElement.textContent = `Upgrade ${this.getConst().toFixed(0)}$`;
                this.value+=this.unit;
                if(this.value >= this.max) buttonElement.remove();
                this.save();
            }
        };
    }
    public getConst(): number{
        return this.initialCost * this.incrementalMultiplier**this.level;
    }
    public static createButton(): [HTMLButtonElement, HTMLElement] {
        const th = document.createElement("th");
        const div = document.createElement("div");
        th.appendChild(div);
        const button = UIManager.createElement<HTMLButtonElement>("button", "Upgrade");
        button.className = "background"
        div.appendChild(button);
        return [button, th];
    }
}

export class InfoProperty extends Saveable<{value: number}> {
    public set value(v: number){
        this.htmlValueElement.textContent = `${this.name}: ${String((this.object.value = v).toFixed(this.fixed))}${this.suffix}`;
        this.save();
    }
    public get value(): number {return this.object.value??0;}
    public htmlValueElement: HTMLElement;
    public constructor(
        id: string,
        public readonly name: string,
        value: number,
        public readonly suffix = "",
        public readonly fixed = 0
    ){
        super(id);
        uiManager.statsDiv.appendChild(this.htmlValueElement = document.createElement("p"));
        this.value = this.object.value??value;
    }
}


export const gameProperties = {
    health: new GameProperty("health","Health", 800, 200, 1.08, 50, 8000),
    stackSize: new GameProperty("projectile_stack","Projectile Stack", 2, 300, 1.1, 1, 10),
    attackSpeed: new GameProperty("attack_speed","Attack Speed", 0.05, 200, 1.01, 0.01, 0.9),
    attackRange: new GameProperty("attack_range","Attack Range", 350, 100, 1.05, 5, 1000)
} as const;

export const infoProperties = {
    level: new InfoProperty("level", "Level", 1),
    gameSpeed: new InfoProperty("gameSpeed", "Speed", 1, "x", 1),
    electrons: new InfoProperty("electrons", "Electrons", 0, "$", 0),
};