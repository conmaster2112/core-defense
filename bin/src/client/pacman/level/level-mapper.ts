import { TextureSource } from "../../../../../app/texture/texture-source";
import { TextureMap } from "../../../../../app/texture/texture-map";

export class LevelMapper {
    private constructor(){}
    public static createTextureMap(textureMap: TextureMap, offsetX: number, size: number): Record<number, TextureSource> {
        const _textureData = (x: number, y: number): TextureSource => textureMap.getTexture(x * size, y * size, size, size);
        const map: Record<number, TextureSource> = {};
        for (let i = 0; i < 256; i++){
            const [x, y] = this.getTextureOffset(i);
            map[i] = _textureData(x + offsetX, Number(y));
        }
        return map;
    }
    public static getTextureOffset(bitMap: number): [number, string | number] {
        let bitsCount = this.getPositiveBitCount(bitMap & 0b01_01_01_01);
        const masks = [...this.getMaskRotations(bitMap, 3)] as Record<number, number>;
        let offset = 0; //17;
        // 0
        if (bitsCount === 0) return [offset, 0];
        offset++;

        //1
        if (bitsCount === 1)
            for (let i in masks) if ((masks[i] & 1) > 0) return [offset, i];
        offset++;

        //2
        if (bitsCount === 2)
            for (let i in masks) {
                if (this.m(masks[i], 0b101)) return [offset + (this.m(masks[i], 0b111) ? 2 : 1), i as any];
                if (this.m(masks[i], 0b10001)) return [offset, i as any];
            }
        offset += 3;

        //3
        if (bitsCount === 3)
            for (let i in masks) {
                let b = masks[i];
                if (this.m(b, 0b10101))
                    if (this.m(b, 0b10111))
                        if (this.m(b, 0b11111)) return [offset + 3, i as any];
                        else return [offset + 1, i as any];
                    else if (this.m(b, 0b11101)) return [offset + 2, i as any];
                    else return [offset, i as any];
            }
        offset += 4;

        // 4
        if (bitsCount === 4) {
            bitsCount = this.getPositiveBitCount(bitMap & 0b10_10_10_10);
            if (bitsCount === 0) return [offset, 0];
            offset++


            if (bitsCount === 1)
                for (let i in masks)
                    if (this.m(masks[i], 0b01010111)) return [offset, i as any];
            offset++;


            if (bitsCount === 2)
                for (let i in masks) {
                    if (this.m(masks[i], 0b01011111)) return [offset, i];
                    if (this.m(masks[i], 0b01110111)) return [offset + 1, i];
                }
            offset += 2;


            if (bitsCount === 3)
                for (let i in masks)
                    if (this.m(masks[i], 0b01111111)) return [offset, i];
            offset++;

            if (bitsCount === 4) return [offset, 0];
        }

        return [0, 0];
    }
    public static m(b1: number, b2: number): boolean { return (b1 & b2) === b2; }
    public static maskRotation(b1: number, offset: number): number {
        const p = (b1 & 0xff) >> offset;
        const p2 = ((b1 & 0xff) << 8 - offset) & 0xff;
        return p | p2;
        const o = (b1 & (~(-1 << offset) << (8 - offset))) >> (8 - offset);
        return (b1 << offset) & 0xff | o;
    }
    public static * getMaskRotations(n1: number, rotations: number): Generator<number> {
        yield n1;
        for (let i = 0; i < rotations; i++) yield n1 = this.maskRotation(n1, 2);
    }
    public static getPositiveBitCount(n: number): number {
        let i = 0;
        do i += n & 1;
        while ((n >>= 1) > 0);
        return i;
    }
}