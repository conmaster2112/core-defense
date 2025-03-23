export function panic(message: string): 1{
    console.error(message);
    return 1;
}
export function success(message?: string): 0{
    if(message) console.info(message);
    return 0;
}
export function warn(message: string): 0{
    console.log(message);
    return 0;
}
export function delay(timeout: number): Promise<void>{
    return new Promise(r=>setTimeout(r, timeout));
}
export * from "./event";