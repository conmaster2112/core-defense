type wglHandle = object;
export class WebGLHandle {
    protected constructor(protected readonly handle: wglHandle){};
    public getHandle(): wglHandle{return this.handle}
}