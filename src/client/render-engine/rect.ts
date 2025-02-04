import { Vec2 } from "../math";
import { TextureSource } from "../texture";
import { BaseRenderLoop } from "./game-loop";
import { Stride } from "./stride";
/*
export class RectStride extends Stride {
    public readonly size;
    public constructor(size: Vec2){
        super();
        this.size = size;
    }
    public tick(): void {
        super.tick();
        this.velocity = this.velocity.multiplyS(0.999);
        if(this.position.y > 1 - this.size.y) this.position.y = 1 - this.size.y
    }
    public render(rLoop: BaseRenderLoop): Vec2 {
        const context = rLoop.context;
        const pos = super.render(rLoop), {x, y} = pos;
        const {x: w, y: h} = rLoop._precomputed.multiply(this.size);
        context.fillRect(x, y, w, h);
        return pos;
    }
}*/
export class RectImgStride<T extends TextureSource> extends Stride {
    public size;
    protected _frame = 0;
    protected _frameMax = 4;
    public constructor(size: Vec2, public readonly texture: T){
        super();
        this.size = (size);
    }
    public tick(): void {
        super.tick();
        this.velocity = this.velocity.multiplyS(0.999);

        if(this.position.y > 1 - this.size.y || this.position.y < 0) {
            if(Math.abs(this.velocity.y) > 0.01) this.velocity.y *= -1.01;
            else this.velocity.y = 0;
            this.position.y = Math.max(Math.min(1 - this.size.y, this.position.y),0)
        }
        else if(Math.abs(this.position.y - 1 + this.size.y) > 0.005) {
            this.velocity.y += 0.0005;
        }
        
        if(this.position.x > 1 - this.size.x || this.position.x < 0) {
            this.velocity.x = 0;
            this.position.x = Math.max(Math.min(1 - this.size.x, this.position.x),0)
        }
        this._frame+=0.4;
    }
    public render(rLoop: BaseRenderLoop): Vec2 {
        const context = rLoop.context;
        const pos = super.render(rLoop);
        const size = rLoop._precomputed.multiply(this.size);
        const flipH = this.velocity.x < 0, flipV = false;
        context.drawTexture(this.texture.getTextureData(), pos, size);
        /*context.save();
        context.setTransform(
            flipH ? -1 : 1, 0, 
            0, flipV ? -1 : 1,
            x + (flipH ? w : 0), y + (flipV ? h : 0)
        );
        if((this._frame & 0b10000) > 0) context.drawImage(this.img, 16, 8, 8, 8, 0,0,w,h);
        else context.drawImage(this.img, (this._frame % this._frameMax) << 3,0,8,8,0,0,w,h);
        context.restore();*/
        return pos;
    }
}