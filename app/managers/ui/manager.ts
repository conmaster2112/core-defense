import { ElementIds } from "../../element-id";

export class UIManager {
    public static getElement<T extends HTMLElement>(id: string): T{
        const e = document.getElementById(id);
        if(!e) throw new ReferenceError("Failed to get element with id of " + id);
        return e! as T;
    }
    // Change instance properties to static and readonly where applicable
    public static readonly canvasElement = UIManager.getElement<HTMLCanvasElement>(ElementIds.ViewportCanvas);
    public static readonly titleElement = UIManager.getElement<HTMLTitleElement>(ElementIds.WindowTitle);
    public static readonly bodyElement = document.body! as HTMLBodyElement;
    public static readonly context = UIManager.canvasElement.getContext("2d")!;
    public static readonly tableTitles = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableTitles);
    public static readonly tableValues = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableValues);
    public static readonly tableButtons = UIManager.getElement<HTMLTableRowElement>(ElementIds.TableButtons);
    public static readonly gameTitle = UIManager.getElement<HTMLHeadingElement>(ElementIds.GameTitle);
    public static readonly statsDiv = UIManager.getElement<HTMLDivElement>(ElementIds.Stats);
    public static clientWidth: number = 0;
    public static clientHeight: number = 0;

    // Change constructor to static initializer
    static {
        if (!UIManager.context)
            throw new ReferenceError("Failed to get context from canvas");

        UIManager.titleElement.textContent = "Core Defense";
        window.addEventListener("resize", () => UIManager.__update());
        UIManager.__update();
    }

    // Change instance methods to static
    public static get title(): string { return UIManager.titleElement.textContent!; }
    public static set title(v: string) { UIManager.titleElement.textContent = v; }
    public static get canvasWidth(): number { return UIManager.canvasElement.width; }
    public static get canvasHeight(): number { return UIManager.canvasElement.height; }
    protected static __update(): void {
        UIManager.clientWidth = UIManager.bodyElement.clientWidth;
        UIManager.clientHeight = UIManager.bodyElement.clientHeight;
    }
    public static close(): void { window.close(); }
    public static setWindowSize(width: number, height: number): void { window.resizeTo(width, height); }
    public static newCanvas(): HTMLCanvasElement { return document.createElement("canvas")!; }
    public static readonly create: Document["createElement"] = document.createElement.bind(document);
}
