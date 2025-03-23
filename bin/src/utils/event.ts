type Subscriber<T extends any[]> = (...params: T)=>void;
export class EventHandler<T extends any[]> {
    protected readonly __methods__ = new Set<Subscriber<T>>();
    public subscribe<S extends Subscriber<T>>(m: S):S{
        this.__methods__.add(m);
        return m;
    }
    public unsubscribe<S extends Subscriber<T>>(m: S):S{
        this.__methods__.delete(m);
        return m;
    }
    public trigger(...arg: T): void{
        for(const m of this.__methods__) m(...arg);
    }
}