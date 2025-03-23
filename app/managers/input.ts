export enum KeyboardKey {
    ArrowDown = "ArrowDown",
    ArrowUp = "ArrowUp",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    Space = " ",
}
export class InputManager {
    public readonly wasPressed: Set<string> = new Set();
    public readonly pressedKeys: Record<string, boolean> = {};
    public constructor(){
        window.addEventListener("keydown", (e)=>{
            if(e.repeat) return; 
            this.pressedKeys[e.key] = true;
            this.wasPressed.add(e.key);
        });
        window.addEventListener("keyup", (e)=>{
            delete this.pressedKeys[e.key];
        });
    }
}
export const inputManager = new InputManager();