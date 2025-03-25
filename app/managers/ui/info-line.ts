import { UIManager } from "./manager";

export class InfoLine {
    public readonly paragraphElement: HTMLParagraphElement;

    private constructor() {
        this.paragraphElement = UIManager.create("p");
    }

    public static create(): InfoLine {
        const infoLine = new InfoLine();
        UIManager.statsDiv.appendChild(infoLine.paragraphElement);
        return infoLine;
    }

    // Add getter and setter for paragraph text
    public get text(): string {
        return this.paragraphElement.textContent!;
    }
    public set text(value: string) {
        this.paragraphElement.textContent = value;
    }
}