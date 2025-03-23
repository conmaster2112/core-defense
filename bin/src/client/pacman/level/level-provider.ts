export abstract class LevelProvider {
    public constructor(public readonly w: number, public readonly h: number){}
    public abstract getAvailability(x: number, y: number): number;
    public getBitMaskFor(x: number, y: number): number {
        const v =
            ((this.getAvailability(x, y - 1) ? 1 : 0) << 0) |
            ((this.getAvailability(x + 1, y - 1)  ? 1 : 0) << 1) |

            ((this.getAvailability(x + 1, y)  ? 1 : 0) << 2) |
            ((this.getAvailability(x + 1, y + 1)  ? 1 : 0) << 3) |

            ((this.getAvailability(x, y + 1)  ? 1 : 0) << 4) |
            ((this.getAvailability(x - 1, y + 1)  ? 1 : 0) << 5) |

            ((this.getAvailability(x - 1, y)  ? 1 : 0) << 6) |
            ((this.getAvailability(x - 1, y - 1) ? 1 : 0) << 7);
        return v;
    }
}