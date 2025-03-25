import { InfoLine } from '../managers/ui/info-line';
import { UpgradePane } from '../managers/ui/upgrade-pane';

export class GameProperties {
    private _level: number;
    private _electrons: number;
    private levelInfoLine: InfoLine;
    private electronsInfoLine: InfoLine;

    private attackSpeed: CoreAbility;
    private attackRange: CoreAbility;
    private maxHealth: CoreAbility;
    private bulletStack: CoreAbility;
    private damage: CoreAbility;

    public constructor() {
        this._level = this.getFromLocalStorage('level', 1);
        this._electrons = this.getFromLocalStorage('electrons', 0);
        this.levelInfoLine = InfoLine.create();
        this.electronsInfoLine = InfoLine.create();
        this.updateUI();

        const all = [
            this.attackSpeed = new CoreAbility('attackSpeed', 'Attack Speed', 0.06, 100, 85, 0.02, 1.2, this.saveAbilityLevel.bind(this)),
            this.attackRange = new CoreAbility('attackRange', 'Attack Range', 350, 100, 10, 50, 1.2, this.saveAbilityLevel.bind(this)),
            this.maxHealth = new CoreAbility('maxHealth', 'Max Health', 100, 100, 10, 50, 1.2, this.saveAbilityLevel.bind(this)),
            this.bulletStack = new CoreAbility('bulletStack', 'Bullet Stack', 2, 200, 8, 1, 1.2, this.saveAbilityLevel.bind(this)),
            this.damage = new CoreAbility('damage', 'Damage', 10, 100, 100, 1, 1.2, this.saveAbilityLevel.bind(this))
        ];
        for(const a of all){
            const v = localStorage.getItem(`${a.nameId}Level`)??null;
            if(v !== null) a.level = parseInt(v);
        }
    }

    public get level(): number {
        return this._level;
    }

    public set level(value: number) {
        this._level = value;
        this.saveToLocalStorage('level', value);
        this.updateUI();
    }

    public get electrons(): number {
        return this._electrons;
    }

    public set electrons(value: number) {
        this._electrons = value;
        this.saveToLocalStorage('electrons', value);
        this.updateUI();
    }

    public get attackSpeedValue(): number {
        return this.attackSpeed.currentValue;
    }

    public get attackRangeValue(): number {
        return this.attackRange.currentValue;
    }

    public get maxHealthValue(): number {
        return this.maxHealth.currentValue;
    }

    public get bulletStackValue(): number {
        return this.bulletStack.currentValue;
    }

    public get damageValue(): number {
        return this.damage.currentValue;
    }

    private saveAbilityLevel(c: CoreAbility): void {
        if(c.level >= c.maxLevel) return;
        if(c.currentCost > this.electrons) return;
        this.electrons -= c.currentCost;
        c.level++;
        this.saveToLocalStorage(`${c.nameId}Level`, c.level);
    }

    private getFromLocalStorage(key: string, defaultValue: number): number {
        const value = localStorage.getItem(key);
        return value !== null ? parseInt(value, 10) : defaultValue;
    }

    private saveToLocalStorage(key: string, value: number): void {
        localStorage.setItem(key, value.toString());
    }

    private updateUI(): void {
        this.levelInfoLine.text = `Level: ${this._level}`;
        this.electronsInfoLine.text = `Electrons: ${this._electrons.toFixed(0)}$`;
    }
}

class CoreAbility {
    public nameId: string;
    public displayName: string;
    public initialValue: number;
    public initialCost: number;
    public maxLevel: number;
    public unitPerLevel: number;
    public costAmplifierPerLevel: number;
    private _level: number;
    private upgradePane: UpgradePane;

    public constructor(nameId: string, displayName: string, initialValue: number, initialCost: number, maxLevel: number, unitPerLevel: number, costAmplifierPerLevel: number, callback: (c: CoreAbility) => void) {
        this.nameId = nameId;
        this.displayName = displayName;
        this.initialValue = initialValue;
        this.initialCost = initialCost;
        this.maxLevel = maxLevel;
        this.unitPerLevel = unitPerLevel;
        this.costAmplifierPerLevel = costAmplifierPerLevel;
        this._level = 0;
        this.upgradePane = UpgradePane.create();
        this.upgradePane.onClick = (): void => void callback(this);
        this.updateUpgradePane();
    }

    public get level(): number {
        return this._level;
    }

    public set level(value: number) {
        this._level = value;
        this.updateUpgradePane();
    }

    public get currentValue(): number {
        return this.initialValue + this.unitPerLevel * this._level;
    }

    public get currentCost(): number {
        return this.initialCost * Math.pow(this.costAmplifierPerLevel, this._level);
    }
    public updateUpgradePane(): void {
        this.upgradePane.title = this.displayName;
        this.upgradePane.value = `Value: ${this.currentValue.toFixed(2)}`;
        this.upgradePane.buttonText = `Upgrade ${this.currentCost.toFixed()}$`;
        if(this.level >= this.maxLevel) this.upgradePane.buttonElement.style.display = "none";
    }
}
