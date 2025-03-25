import { UIManager } from "./manager";

export class UpgradePane {
    public readonly titleElement;
    public readonly valueElement;
    public readonly buttonElement;

    private constructor() {
        this.titleElement = UIManager.create("th");
        this.valueElement = UIManager.create("td");

        const td = UIManager.create("td");
        const div = UIManager.create("div");
        td.appendChild(div);

        this.buttonElement =  UIManager.create("button");
        this.buttonElement.className = "background";
        div.appendChild(this.buttonElement);
    }

    public static create(): UpgradePane {
        const upgradePane = new UpgradePane();
        UIManager.tableTitles.appendChild(upgradePane.titleElement);
        UIManager.tableValues.appendChild(upgradePane.valueElement);
        UIManager.tableButtons.appendChild(upgradePane.buttonElement.parentElement!.parentElement!);
        return upgradePane;
    }

    // Add getter and setter for title
    public get title(): string {
        return this.titleElement.textContent!;
    }
    public set title(value: string) {
        this.titleElement.textContent = value;
    }

    // Add getter and setter for value
    public get value(): string {
        return this.valueElement.textContent!;
    }
    public set value(value: string) {
        this.valueElement.textContent = value;
    }

    // Add getter and setter for button
    public get buttonText(): string {
        return this.buttonElement.textContent!;
    }
    public set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    // Add getter and setter for onclick action
    public get onClick(): (null | (() => void)) {
        return this.buttonElement.onclick as () => void;
    }
    public set onClick(action: () => void) {
        this.buttonElement.onclick = action;
    }
}